const {
	check,
	expressValidator,
	validationResult,
} = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

// Custom Middlewares
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	requestProperty: "auth",
	algorithms: ["HS256"],
});

exports.isAuthenticated = (req, res, next) => {
	let isAuthenticated =
		req.profile && req.auth && req.profile._id == req.auth._id;
	if (!isAuthenticated) {
		return this.getErrorMesaageInJson(res, 400, "Access denied");
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	let isAdmin = req.profile.role === 1;
	if (!isAdmin) {
		return this.getErrorMesaageInJson(res, 400, "Access denied NOT an ADMIN");
	}
	next();
};

exports.getErrorMesaageInJson = (res, statusCode, errorMessage) => {
	return res.status(statusCode).json({ error: errorMessage });
};

exports.sendResponse = (res, json) => {
	return res.status(200).json(json);
};

// Params
exports.getUserById = (req, res, next, userId) => {
	User.findById(userId).exec((error, user) => {
		if (error || !user) {
			return this.getErrorMesaageInJson(res, 400, "User does not exist");
		}
		user
			.populate("followers", this.FOLLOW_FIELDS_TO_POPULATE)
			.populate("following", this.FOLLOW_FIELDS_TO_POPULATE)
			.populate("posts")
			.execPopulate()
			.then(() => {
				console.log("USERBY ID", user);
				req.profile = user;
				next();
			});
	});
};

exports.getPostById = (req, res, next, postId) => {
	Post.findById(postId).exec((error, post) => {
		if (error || !post) {
			return this.getErrorMesaageInJson(res, 400, "Cannot get postById");
		}
		post
			.populate("user", this.USER_FIELDS_TO_POPULATE)
			.execPopulate()
			.then(() => {
				console.log("POST BY ID", post);
				req.post = post;
				next();
			});
	});
};

exports.getCommentById = (req, res, next, commentId) => {
	Comment.findById(commentId).exec((error, comment) => {
		if (error || !comment) {
			return this.getErrorMesaageInJson(res, 400, "comment does not exist");
		}
		comment
			.populate("user", this.USER_FIELDS_TO_POPULATE)
			.populate("post")
			.execPopulate()
			.then(() => {
				console.log("commentBY ID", comment);
				req.comment = comment;
				next();
			});
	});
};

// Constant variables
exports.FOLLOW_FIELDS_TO_POPULATE = "_id username name profilePhoto";
exports.USER_FIELDS_TO_POPULATE =
	"_id username name profilePhoto followers following bio coverPhoto";
exports.EXPLORE_USERS_FIELDS_TO_POPULATE =
	"_id username name profilePhoto followers postCount";
