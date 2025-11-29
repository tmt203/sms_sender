import Message from "../models/message.model.js";
import Template from "../models/template.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "../utils/handlerFactory.js";
import axios from "axios";

const SMS_API_URL = process.env.SMS_API_URL;
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_API_DEVICES = process.env.SMS_API_DEVICES;

export const sendCustomMessage = catchAsync(async (req, res, next) => {
	const { phone_number, message } = req.body;

	try {
		await axios.get(SMS_API_URL, {
			params: {
				key: SMS_API_KEY,
				number: phone_number,
				message,
				devices: SMS_API_DEVICES,
				type: "sms",
				prioritize: 0,
			},
		});
		res.status(200).json({
			code: "OK",
			status: "success",
			message: "Message sent successfully",
		});
	} catch (error) {
		console.error("Error sending SMS:", error.message);
		res
			.status(500)
			.json({ code: "ERR_SMS_SEND", message: "Error sending SMS", error: error.message });
	}
});

export const createMessage = catchAsync(async (req, res, next) => {
	const { template_id, destinations } = req.body;

	const template = await Template.findById(template_id);
	if (!template) {
		return next(new AppError("Template not found", 404, "ERR_TEMPLATE_NOT_FOUND"));
	}

	const { content, params } = template;

	const renderedMessages = destinations.map((destination) => {
		const { phone_number, list_param = {} } = destination;

		const missingParams = params.filter((param) => !list_param.hasOwnProperty(param));
		if (missingParams.length > 0) {
			throw new AppError(
				`Missing parameters: ${missingParams.join(", ")}`,
				400,
				"ERR_MISSING_TEMPLATE_PARAMS"
			);
		}

		const finalContent = content.replace(/{{\s*(\w+)\s*}}/g, (_, key) => list_param[key] || "");

		return {
			phone_number: `+84${phone_number.slice(1)}`,
			message: finalContent,
		};
	});

	try {
		await Promise.all(
			renderedMessages.map(({ phone_number, message }) =>
				axios.get(SMS_API_URL, {
					params: {
						key: SMS_API_KEY,
						number: phone_number,
						message,
						devices: SMS_API_DEVICES,
						type: "sms",
						prioritize: 0,
					},
				})
			)
		);

		res.status(201).json({
			code: "OK",
			status: "success",
			message: "Messages sent successfully",
		});
	} catch (error) {
		console.error("Error sending SMS:", error.message);
		res
			.status(500)
			.json({ code: "ERR_SMS_SEND", message: "Error sending SMS", error: error.message });
	}
});

export const getMessage = factory.getOne(Message);
export const getAllMessages = factory.getAll(Message);
export const updateMessage = factory.updateOne(Message);
export const deleteMessage = factory.deleteOne(Message);
