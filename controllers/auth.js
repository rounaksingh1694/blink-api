const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const {
	check,
	expressValidator,
	validationResult,
} = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const {
	isSignedIn,
	isAuthenticated,
	getErrorMesaageInJson,
	FOLLOW_FIELDS_TO_POPULATE,
} = require("../controllers/base");

const generateAccessToken = (userId) => {
	return jwt.sign({ _id: userId }, process.env.SECRET);
};

const authSuccessResponse = (res, user) => {
	const accessToken = generateAccessToken(user._id);
	return res.status(200).json({
		accessToken: accessToken,
		user: {
			_id: user._id,
			name: user.name,
			username: user.username,
			posts: user.posts,
			followers: user.followers,
			following: user.following,
			profilePhoto: user.profilePhoto,
		},
	});
};

exports.signUp = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("ERRORSSS", errors);
		return res.status(401).json({
			error: errors.array()[0].msg,
			parameter: errors.array()[0].param,
		});
	}

	const user = new User(req.body);

	user.save((error, user) => {
		if (error || !user) {
			console.error("ERROR SIGN UP", error);
			return getErrorMesaageInJson(res, 400, "This username already exists.");
		}
		return authSuccessResponse(res, user);
	});
};

exports.signIn = (req, res) => {
	const { username, password } = req.body;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("ERRORSSS", errors);
		return res.status(401).json({
			error: errors.array()[0].msg,
			parameter: errors.array()[0].param,
		});
	}

	User.findOne({ username }, (error, user) => {
		if (error || !user) {
			return getErrorMesaageInJson(res, 400, "User does not exist");
		}

		if (!user.authenticate(password)) {
			return getErrorMesaageInJson(res, 400, "Username & password don't match");
		}

		user
			.populate("posts")
			.populate("followers", FOLLOW_FIELDS_TO_POPULATE)
			.populate("following", FOLLOW_FIELDS_TO_POPULATE)
			.execPopulate()
			.then(() => {
				return authSuccessResponse(res, user);
			});
	});
};

exports.signOut = (req, res) => {
	res.status(200).json({
		message: "Sign out successfull",
	});
};
