const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const {
	check,
	expressValidator,
	validationResult,
} = require("express-validator");

const {
	isSignedIn,
	isAuthenticated,
	getErrorMesaageInJson,
	sendResponse,
	FOLLOW_FIELDS_TO_POPULATE,
	USER_FIELDS_TO_POPULATE,
	getPostById,
	EXPLORE_USERS_FIELDS_TO_POPULATE,
} = require("./base");

exports.getPostsForExplore = (req, res) => {
	console.log("EXPLORE MEIN AAYA");
	Post.find({}).exec((error, posts) => {
		console.log("POSTS", posts);
		console.log("ERROR", error);
		if (error)
			return getErrorMesaageInJson(res, 400, "Error in fetching posts");
		if (posts.length === 0)
			return getErrorMesaageInJson(res, 400, "There are no posts to explore");
		sendResponse(res, { posts });
	});
};

exports.getUsersForExplore = (req, res) => {
	User.aggregate([
		{ $match: {} },
		{
			$project: {
				postCount: { $size: "$posts" },
				followerCount: { $size: "$followers" },
				followingCount: { $size: "$following" },
				username: 1,
				profilePhoto: 1,
				name: 1,
			},
		},
	]).exec((error, users) => {
		if (error) {
			console.log("ERROR IN EXPLORE SUERS", error);
			return getErrorMesaageInJson(res, 400, "Error in getting all users");
		}
		if (!users) return getErrorMesaageInJson(res, 400, "There are no users");
		sendResponse(res, { users });
	});
};
