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
	getPostsForExplore,
	getUsersForExplore,
} = require("../controllers/explore");

router.param("userId", getUserById);

router.get("/posts/:userId", isSignedIn, isAuthenticated, getPostsForExplore);
router.get("/users/:userId", isSignedIn, isAuthenticated, getUsersForExplore);

module.exports = router;
