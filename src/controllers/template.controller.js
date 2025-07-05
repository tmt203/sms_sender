import Template from "../models/template.model.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "../utils/handlerFactory.js";
import AppError from "../utils/appError.js";

export const handleParams = catchAsync(async (req, res, next) => {
	const { content } = req.body;

	// Check if content has duplicate params
	const paramMatches = content.match(/{{(.*?)}}/g);
	if (paramMatches) {
		const uniqueParams = new Set(paramMatches.map((m) => m.replace(/[{}]/g, "").trim()));
		if (uniqueParams.size !== paramMatches.length) {
			return next(new AppError("Template params duplicate", 400, "ERR_TEMPLATE_PARAMS_DUPLICATE"));
		}
	}

	const matches = content.match(/{{(.*?)}}/g);
	const params = matches ? matches.map((m) => m.replace(/[{}]/g, "").trim()) : [];

	req.body.params = params;

	next();
});

export const createTemplate = factory.createOne(Template);
export const updateTemplate = factory.updateOne(Template);
export const getTemplate = factory.getOne(Template);
export const getAllTemplates = factory.getAll(Template);
export const deleteTemplate = factory.deleteOne(Template);
export const deleteTemplates = factory.deleteMany(Template);
