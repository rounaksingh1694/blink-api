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
const user = require("../models/user");

exports.getUser = (req, res) => {
	const { _id, username, name, posts, followers, following, profilePhoto } =
		req.profile;
	sendResponse(res, {
		user: {
			_id,
			username,
			name,
			posts,
			followers,
			following,
			profilePhoto,
		},
	});
};

exports.getUserProfilePhoto = (req, res) => {
	sendResponse(res, {
		_id: req.profile._id,
		profilePhoto: req.profile.profilePhoto,
	});
};

exports.getAllUsers = (req, res) => {
	User.find()
		.populate("posts")
		.exec((error, users) => {
			if (error)
				return getErrorMesaageInJson(res, 400, "Error in getting all users");
			if (!users) return getErrorMesaageInJson(res, 400, "There are no users");
			sendResponse(res, { users });
		});
};
