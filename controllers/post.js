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
} = require("../controllers/base");

exports.createPost = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("ERRORSSS", errors);
		return res.status(401).json({
			error: errors.array()[0].msg,
			parameter: errors.array()[0].param,
		});
	}
	const body = req.body;
	const post = {
		user: req.profile._id,
		postUrl: body.postUrl,
		description: body.description,
	};
	Post.create(post, (error, newPost) => {
		if (error || !newPost) {
			return getErrorMesaageInJson(res, 400, "Failed to create post");
		}

		User.findOneAndUpdate(
			{ _id: req.profile._id },
			{ $push: { posts: newPost._id } },
			{ new: true },
			(err, user) => {
				if (err || !user) {
					return getErrorMesaageInJson(res, 400, "Failed to create post");
				}
				newPost
					.populate("user", USER_FIELDS_TO_POPULATE)
					.execPopulate()
					.then(() => sendResponse(res, newPost));
			}
		);
	});
};

exports.likePost = (req, res) => {
	const post = req.post;
	console.log("POST TO LIKE", post);
	const user = req.profile;
	Post.findOneAndUpdate(
		{ _id: post._id },
		{ $push: { likes: user._id } },
		{ new: true },
		(error, newPost) => {
			if (error || !newPost) {
				console.error("ERROR IN LIKE", error);
				return getErrorMesaageInJson(res, 400, "Failed to like post");
			}
			sendResponse(res, {
				message: "Liked post",
			});
		}
	);
};

exports.unlikePost = (req, res) => {
	const post = req.post;
	console.log("POST TO LIKE", post);
	const user = req.profile;
	Post.findOneAndUpdate(
		{ _id: post._id },
		{ $pull: { likes: user._id } },
		{ new: true },
		(error, newPost) => {
			if (error || !newPost) {
				console.error("ERROR IN UNLIKE", error);
				return getErrorMesaageInJson(res, 400, "Failed to unlike post");
			}
			sendResponse(res, {
				message: "Unliked post",
			});
		}
	);
};

exports.getLikesOnAPost = (req, res) => {
	Post.findOne({ _id: req.post._id })
		.select("likes")
		.populate("likes", USER_FIELDS_TO_POPULATE)
		.exec((error, likes) => {
			if (error || !likes) {
				return getErrorMesaageInJson(res, 400, "Failed to fetch likes on post");
			}
			sendResponse(res, likes);
		});
};

exports.getAllPostsByUser = (req, res) => {
	const user = req.profile;
	Post.find({ user: user._id })
		.populate("user", USER_FIELDS_TO_POPULATE)
		.exec((error, posts) => {
			if (error || !posts) {
				return getErrorMesaageInJson(res, 400, "Failed to get all posts");
			}
			sendResponse(res, { posts });
		});
};

exports.getPostsByUserFollowing = (req, res) => {
	const user = req.profile;
	user.depopulate("following").execPopulate(() => {
		console.log("FOLLOWING", user.following);
		Post.find({ user: { $in: user.following } })
			.populate("user", USER_FIELDS_TO_POPULATE)
			.exec((error, posts) => {
				if (error)
					return getErrorMesaageInJson(res, 400, "Error in fetching posts");
				if (posts.length === 0)
					return getErrorMesaageInJson(
						res,
						400,
						"There are no posts from your followers"
					);
				sendResponse(res, { posts });
			});
	});
};
