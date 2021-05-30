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
	getUser,
	getUserProfilePhoto,
	getAllUsers,
} = require("../controllers/user");

router.param("userId", getUserById);

router.get("/:userId", isSignedIn, isAuthenticated, getUser);

router.get(
	"/profilePhoto/:userId",
	isSignedIn,
	isAuthenticated,
	getUserProfilePhoto
);

router.get("/all/:userId", isSignedIn, isAuthenticated, getAllUsers);

module.exports = router;
