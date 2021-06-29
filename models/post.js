const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const postSchema = new Schema(
	{
		user: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		likes: [
			{
				type: ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				type: ObjectId,
				ref: "Comment",
			},
		],
		postUrl: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxLength: 128,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
