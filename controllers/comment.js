const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

const {
	isSignedIn,
	isAuthenticated,
	getErrorMesaageInJson,
	sendResponse,
	FOLLOW_FIELDS_TO_POPULATE,
	USER_FIELDS_TO_POPULATE,
	getPostById,
} = require("../controllers/base");

exports.createComment = (req, res) => {
	const user = req.profile;
	const post = req.post;

	const comment = {
		user: user._id,
		post: post._id,
		comment: req.body.comment,
	};

	Comment.create(comment, (error, newComment) => {
		if (error || !newComment) {
			return getErrorMesaageInJson(res, 400, "Cannot comment on this post");
		}
		Post.findOneAndUpdate(
			{ _id: post._id },
			{ $push: { comments: newComment._id } },
			{ new: true },
			(err, newPost) => {
				if (err || !newPost) {
					return getErrorMesaageInJson(res, 400, "Cannot comment on this post");
				}
				newComment
					.populate("user", USER_FIELDS_TO_POPULATE)
					.populate("post")
					.execPopulate()
					.then(() => sendResponse(res, newComment));
			}
		);
	});
};

exports.deleteComment = (req, res) => {
	const user = req.profile;
	const post = req.post;

	const comment = req.comment;

	Comment.findOneAndDelete({ _id: comment._id }, (error, newComment) => {
		if (error || !newComment) {
			return getErrorMesaageInJson(
				res,
				400,
				"Cannot delete comment on this post"
			);
		}
		Post.findOneAndUpdate(
			{ _id: post._id },
			{ $pull: { comments: newComment._id } },
			{ new: true },
			(err, newPost) => {
				if (err || !newPost) {
					return getErrorMesaageInJson(
						res,
						400,
						"Cannot delete comment on this post"
					);
				}
				newComment
					.populate("user", USER_FIELDS_TO_POPULATE)
					.populate("post")
					.execPopulate()
					.then(() => sendResponse(res, newComment));
			}
		);
	});
};

exports.getAllComments = (req, res) => {
	const post = req.post;
	Comment.find({ post: post._id }, (error, comments) => {
		if (error) {
			return getErrorMesaageInJson(
				res,
				400,
				"Cannot get comments on this post"
			);
		}
		if (!comments) {
			return getErrorMesaageInJson(
				res,
				400,
				"There are no comments on this post"
			);
		}
		sendResponse(res, { comments });
	});
};
