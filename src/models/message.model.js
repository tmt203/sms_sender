import { Schema } from "mongoose";

const destinationSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: [true, "ERR_DESTINATION_PHONE_REQUIRED"],
    },
    list_param: {
      type: Map,
      of: String, // Record<string, string>
      default: {},
    },
  },
  { _id: false } // nested schema does not need its own _id
);

const messageSchema = new Schema({
  template_id: {
    type: String,
    required: [true, "ERR_MESSAGE_TEMPLATE_ID_REQUIRED"],
  },
  destinations: {
    type: [destinationSchema],
    required: [true, "ERR_MESSAGE_DESTINATIONS_REQUIRED"],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "ERR_DESTINATIONS_MUST_HAVE_AT_LEAST_ONE",
    },
  },
});

messageSchema.set("timestamps", true);
messageSchema.set("toJSON", {
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

const Message = model("Message", messageSchema);

export default Message;
