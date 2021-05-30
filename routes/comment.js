const express = require("express");
const router = express.Router();
const { check, expressValidator } = require("express-validator");

const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getUserById,
	getPostById,
	getCommentById,
} = require("../controllers/base");

const {
	createComment,
	deleteComment,
	getAllComments,
} = require("../controllers/comment");

router.param("userId", getUserById);
router.param("postId", getPostById);
router.param("commentId", getCommentById);

router.post(
	"/create/:postId/:userId",
	isSignedIn,
	isAuthenticated,
	createComment
);

router.delete(
	"/delete/:postId/:commentId/:userId",
	isSignedIn,
	isAuthenticated,
	deleteComment
);

router.get("/all/:postId/:userId", isSignedIn, isAuthenticated, getAllComments);

module.exports = router;
