import Message from "../models/message.model.js";
import Template from "../models/template.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "../utils/handlerFactory.js";
import { sendSMS } from "../utils/handlerSMS.js";

export const createMessage = catchAsync(async (req, res, next) => {
  const { template_id, destinations } = req.body;

  const template = await Template.findById(template_id);
  if (!template) {
    return next(
      new AppError("Template not found", 404, "ERR_TEMPLATE_NOT_FOUND")
    );
  }

  const { content, params } = template;

  const renderedMessages = [];

  for (const destination of destinations) {
    const { phone_number, list_param = {} } = destination;

    const missingParams = params.filter(
      (param) => !list_param.hasOwnProperty(param)
    );

    if (missingParams.length > 0) {
      return next(
        new AppError(
          `Missing parameters: ${missingParams.join(", ")}`,
          400,
          "ERR_MISSING_TEMPLATE_PARAMS"
        )
      );
    }

    // Render nội dung tin nhắn
    const finalContent = content.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
      return list_param[key] || "";
    });

    renderedMessages.push({
      phone_number,
      message: finalContent,
    });
  }

  const phones = renderedMessages.map(
    (msg) => `+84${msg.phone_number.slice(1)}`
  );
  const messages = renderedMessages.map((msg) => msg.message);

  try {
    const response = await sendSMS(phones, messages[0]);
    res.status(200).json({ message: "SMS sent successfully", data: response });
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    res
      .status(500)
      .json({ message: "Error sending SMS", error: error.message });
  }
});

export const getMessage = factory.getOne(Message);
export const getAllMessages = factory.getAll(Message);
export const updateMessage = factory.updateOne(Message);
export const deleteMessage = factory.deleteOne(Message);
