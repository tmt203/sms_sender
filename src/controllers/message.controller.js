import Message from "../models/message.model.js";
import Template from "../models/template.model.js"
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "../utils/handlerFactory.js";

export const createMessage = catchAsync(async (req, res, next) => {
    const { template_id, destinations: { phone_number, list_param } } = req.body;
    const template = await Template.findById(template_id);

    if (!template) {
        return next(new AppError("Template not found", 404, "ERR_TEMPLATE_NOT_FOUND"));
    }

    const content = template.content;
    const params = template.params;

    const missingParams = params.filter(param => !list_param.has(param));
    if (missingParams.length > 0) {
        return next(new AppError(`Missing parameters: ${missingParams.join(", ")}`, 400, "ERR_MISSING_TEMPLATE_PARAMS"));
    }

    
});

export const getMessage = factory.getOne(Message);
export const getAllMessages = factory.getAll(Message);
export const updateMessage = factory.updateOne(Message);
export const deleteMessage = factory.deleteOne(Message);
