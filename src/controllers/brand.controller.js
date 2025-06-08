import Brand from "../models/brand.model.js";
import * as factory from "../utils/handlerFactory.js";

export const getBrand = factory.getOne(Brand);
export const getAllBrands = factory.getAll(Brand);
export const createBrand = factory.createOne(Brand);
export const updateBrand = factory.updateOne(Brand);
export const deleteBrand = factory.deleteOne(Brand);
export const deleteBrands = factory.deleteMany(Brand);