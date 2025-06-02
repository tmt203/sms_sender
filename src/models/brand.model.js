import { Schema, model } from "mongoose";

const brandSchema = new Schema({
  name: {
    type: String,
    required: [true, "ERR_BRAND_NAME_REQUIRED"],
    trim: true,
    unique: true,
    maxlength: [50, "ERR_BRAND_NAME_TOO_LONG"],
    minlength: [2, "ERR_BRAND_NAME_TOO_SHORT"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, "ERR_BRAND_DESCRIPTION_TOO_LONG"],
  },
  channel: {
    type: String,
    required: [true, "ERR_BRAND_CHANNEL_REQUIRED"],
    enum: {
      values: ["sms"],
      message: "ERR_BRAND_CHANNEL_INVALID",
    },
  },
});

brandSchema.set("timestamps", true);
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;

    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret._id;

    return ret;
  },
});

const Brand = model("Brand", brandSchema);

export default Brand;
