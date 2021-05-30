const express = require("express");
const router = express.Router();
const { check, expressValidator } = require("express-validator");

const {
	follow,
	unfollow,
	getAllFollowers,
	getAllFollowing,
} = require("../controllers/follow");
const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getUserById,
} = require("../controllers/base");

router.param("userId", getUserById);

/* 
userTofollow is an object
userToFollow: {
    _id: String,
    username: String
}
*/
router.post(
	"/follow/:userId",
	[check("userToFollow", "Specify the user to be followed").not().isEmpty()],
	isSignedIn,
	isAuthenticated,
	follow
);

/* 
userTofollow is an object
userToFollow: {
    _id: String,
    username: String
}
*/
router.post(
	"/unfollow/:userId",
	[
		check("userToUnfollow", "Specify the user to be unfollowed")
			.not()
			.isEmpty(),
	],
	isSignedIn,
	isAuthenticated,
	unfollow
);

router.get(
	"/followers/all/:userId",
	isSignedIn,
	isAuthenticated,
	getAllFollowers
);
router.get(
	"/following/all/:userId",
	isSignedIn,
	isAuthenticated,
	getAllFollowing
);

module.exports = router;
