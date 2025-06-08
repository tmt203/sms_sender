import Template from "../models/template.model.js";
import * as factory from "../utils/handlerFactory.js";

export const getTemplate = factory.getOne(Template);
export const getAllTemplates = factory.getAll(Template);
export const createTemplate = factory.createOne(Template);
export const updateTemplate = factory.updateOne(Template);
export const deleteTemplate = factory.deleteOne(Template);
export const deleteTemplates = factory.deleteMany(Template);
