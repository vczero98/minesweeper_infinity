var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
	res.render("landing");
});

router.get("/shop", function(req, res) {
	res.render("shop", {selectedPage: "shop"});
});

router.get("/profiles", function(req, res) {
	res.render("profiles");
});

router.get("/profiles/:reqUsername", function(req, res) {
	User.find({username: req.params.reqUsername}, function(err, users){
		if (err) {
			console.log(err);
			res.redirect("/profiles");
		} else {
			var foundUser = users[0];
			if (foundUser) {
				res.render("profile", {foundUser: foundUser});
			} else {
				req.flash("error", "User with username " + req.params.reqUsername + " could not be found.");
				res.redirect("/profiles");
			}
		}
	});
});

router.get("/halloffame", function(req, res) {
	res.render("halloffame", {selectedPage: "halloffame"});
});

// AUTH Routes
router.get("/register", function(req, res){
	res.render("register", {selectedPage: "register"});
});

// Handle signup logic
router.post("/register", function(req, res){
	if (req.body.password.length < 6) {
		res.redirect("/");
	}
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			req.flash("error", err.message);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/rooms");
			});
		}
	});
});

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	// successRedirect: "/rooms",
	failureRedirect: "/login"
}), function(req, res){
	if (req.get('referer').includes("login")) {
		res.redirect("/rooms");
	} else {
		res.redirect(req.get('referer'));
	}
});

// Logout route
router.get("/logout", function(req, res){
	req.logout();
	// req.flash("success", "You have been logged out");
	res.redirect("/");
});

module.exports = router;
