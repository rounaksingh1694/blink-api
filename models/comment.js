const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const commentSchema = new Schema({
	user: {
		type: ObjectId,
		ref: "User",
	},
	post: {
		type: ObjectId,
		ref: "Post",
	},
	comment: {
		type: String,
		required: true,
		trim: true,
	},
});

module.exports = mongoose.model("Comment", commentSchema);
