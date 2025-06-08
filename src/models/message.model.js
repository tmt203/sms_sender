import { Schema, model } from "mongoose";

const destinationSchema = new Schema(
	{
		phone_number: {
			type: String,
		},
		email: {
			type: String,
			match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "ERR_DESTINATION_EMAIL_INVALID"],
		},
		list_param: {
			type: Map,
			of: String, // Record<string, string>
			default: {},
		},
	},
	{ _id: false } // nested schema does not need its own _id
);

const messageSchema = new Schema(
	{
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

const Message = model("Message", messageSchema);

export default Message;
