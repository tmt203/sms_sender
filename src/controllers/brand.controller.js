import Brand from "../models/brand.model.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "../utils/handlerFactory.js";
import AppError from "../utils/appError.js";
import Template from "../models/template.model.js";

export const handleDeleteTemplatesInBrand = catchAsync(async (req, res, next) => {
	const brandId = req.params.id;
	const brands = req.body.ids;

	if (brandId) {
		await Template.deleteMany({ brand_id: brandId });
	}

	if (brands && brands.length > 0) {
		await Template.deleteMany({ brand_id: { $in: brands } });
	}

	next();
});

export const getBrand = factory.getOne(Brand);
export const getAllBrands = factory.getAll(Brand);
export const createBrand = factory.createOne(Brand);
export const updateBrand = factory.updateOne(Brand);
export const deleteBrand = factory.deleteOne(Brand);
export const deleteBrands = factory.deleteMany(Brand);
