const User = require("../models/user");

const {
	isSignedIn,
	isAuthenticated,
	getErrorMesaageInJson,
	sendResponse,
	FOLLOW_FIELDS_TO_POPULATE,
} = require("../controllers/base");

exports.follow = (req, res) => {
	const user = req.profile;
	console.log("PROFILE", user);
	const userToFollow = req.body.userToFollow;
	User.findOneAndUpdate(
		{ _id: user._id },
		{ $push: { following: userToFollow._id } },
		{ new: true },
		(error, newUser) => {
			if (error || !newUser) {
				return getErrorMesaageInJson(res, 400, "Cannot follow user");
			}
			User.findOneAndUpdate(
				{ _id: userToFollow._id },
				{ $push: { followers: user._id } },
				{ new: true },
				(error, followedUser) => {
					if (error || !followedUser) {
						return getErrorMesaageInJson(res, 400, "Cannot follow user");
					}
					newUser
						.populate("following", FOLLOW_FIELDS_TO_POPULATE)
						.populate("followers", FOLLOW_FIELDS_TO_POPULATE)
						.execPopulate()
						.then(() => {
							sendResponse(res, {
								message: `Successfully followed ${userToFollow.username}`,
								user: {
									name: newUser.name,
									username: newUser.newUsername,
									posts: newUser.posts,
									followers: newUser.followers,
									following: newUser.following,
								},
							});
						});
				}
			);
		}
	);
};

exports.unfollow = (req, res) => {
	const user = req.profile;
	console.log("PROFILE", user);
	const userToUnfollow = req.body.userToUnfollow;
	User.findOneAndUpdate(
		{ _id: user._id },
		{ $pull: { following: userToUnfollow._id } },
		{ new: true },
		(error, newUser) => {
			if (error || !newUser) {
				return getErrorMesaageInJson(res, 400, "Cannot unfollow user");
			}
			User.findOneAndUpdate(
				{ _id: userToUnfollow._id },
				{ $pull: { followers: user._id } },
				{ new: true },
				(error, unfollowedUser) => {
					if (error || !unfollowedUser) {
						return getErrorMesaageInJson(res, 400, "Cannot unfollow user");
					}
					newUser
						.populate("following", FOLLOW_FIELDS_TO_POPULATE)
						.populate("followers", FOLLOW_FIELDS_TO_POPULATE)
						.execPopulate()
						.then(() => {
							sendResponse(res, {
								message: `Successfully unfollowed ${userToUnfollow.username}`,
								user: {
									name: newUser.name,
									username: newUser.newUsername,
									posts: newUser.posts,
									followers: newUser.followers,
									following: newUser.following,
								},
							});
						});
				}
			);
		}
	);
};

exports.getAllFollowers = (req, res) => {
	const user = req.profile;
	User.findOne({ _id: user._id })
		.select("followers")
		.populate("followers", FOLLOW_FIELDS_TO_POPULATE)
		.exec((error, followers) => {
			if (error || !followers) {
				return getErrorMesaageInJson(res, 400, "No followers present");
			}
			sendResponse(res, followers);
		});
};

exports.getAllFollowing = (req, res) => {
	const user = req.profile;
	User.findOne({ _id: user._id })
		.select("following")
		.populate("following", FOLLOW_FIELDS_TO_POPULATE)
		.exec((error, following) => {
			if (error || !following) {
				return getErrorMesaageInJson(res, 400, "No following present");
			}
			sendResponse(res, following);
		});
};
