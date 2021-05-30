const express = require("express");
const router = express.Router();
const { check, expressValidator } = require("express-validator");

const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getUserById,
	getPostById,
} = require("../controllers/base");
const {
	createPost,
	likePost,
	getAllPostsByUser,
	getLikesOnAPost,
	getPostsByUserFollowing,
} = require("../controllers/post");

router.param("userId", getUserById);
router.param("postId", getPostById);

router.post(
	"/create/:userId",
	[
		check("postUrl", "postUrl is required").not().isEmpty(),
		check("description", "description is required").not().isEmpty(),
	],
	isSignedIn,
	isAuthenticated,
	createPost
);

router.get("/like/:postId/:userId", isSignedIn, isAuthenticated, likePost);

router.get("/all/:userId", isSignedIn, isAuthenticated, getAllPostsByUser);

router.get(
	"/likes/:postId/:userId",
	isSignedIn,
	isAuthenticated,
	getLikesOnAPost
);

router.get(
	"/feed/:userId",
	isSignedIn,
	isAuthenticated,
	getPostsByUserFollowing
);

module.exports = router;
