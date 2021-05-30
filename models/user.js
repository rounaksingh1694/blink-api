const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		encryptedPassword: {
			type: String,
			required: true,
		},
		posts: [
			{
				type: ObjectId,
				ref: "Post",
			},
		],
		followers: [
			{
				type: ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: ObjectId,
				ref: "User",
			},
		],
		salt: String,
		profilePhoto: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema
	.virtual("password")
	.set(function (password) {
		console.log("PASSWORD", password);
		this._password = password;
		this.salt = uuidv1();
		console.log("SALT", this.salt);
		this.encryptedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

userSchema.methods = {
	authenticate: function (password) {
		return this.encryptPassword(password) == this.encryptedPassword;
	},
	encryptPassword: function (password) {
		if (!password) return "";
		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(password)
				.digest("hex");
		} catch (e) {
			console.error(e);
		}
	},
};

module.exports = mongoose.model("User", userSchema);
