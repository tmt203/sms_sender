import { Schema, model } from "mongoose";

const templateSchema = new Schema(
	{
		brand_id: {
			type: String,
			required: [true, "ERR_TEMPLATE_BRAND_REQUIRED"],
		},
		name: {
			type: String,
			required: [true, "ERR_TEMPLATE_NAME_REQUIRED"],
			trim: true,
			unique: true,
			maxlength: [50, "ERR_TEMPLATE_NAME_TOO_LONG"],
			minlength: [2, "ERR_TEMPLATE_NAME_TOO_SHORT"],
		},
		content: {
			type: String,
			required: [true, "ERR_TEMPLATE_CONTENT_REQUIRED"],
			trim: true,
			maxlength: [500, "ERR_TEMPLATE_CONTENT_TOO_LONG"],
		},
		params: {
			type: [String],
			default: [],
			validate: {
				validator: function (v) {
					return v.every((param) => typeof param === "string");
				},
				message: "ERR_TEMPLATE_PARAMS_INVALID",
			},
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: function (_, ret) {
				delete ret._id;
				return ret;
			},
		},
	}
);

const Template = model("Template", templateSchema);

export default Template;
