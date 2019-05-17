const express = require('express');
const passport = require("passport");

const router = new express.Router();

const sQuestions = [
	"What was the street name you lived in as a child?",
	"What were the last four digits of your telephone number?",
	"What primary school did you attend?",
	"In what town or city was your first full time job?",
	"In what town or city did you meet your spouse/partner?",
	"What is the middle name of your oldest child?",
	"What year did club penguin end?",
	"What is your grandmother's maiden name?",
	"What is your spouse or partner's mother's maiden name?",
	"In what town or city did your mother and father meet?",
	"What time of the day were you born? (hh:mm)",
	"What time of the day was your first child born? (hh:mm)"
];

var staticData = {
	s1Questions: sQuestions.slice(0,5),
	s2Questions: sQuestions.slice(5,100),
}


router
    .route("/")
    .get((request, response) => {
        request.session.destroy(function (err) {
            response.render("login.hbs", {
                title: "Welcome to the login page.",
                display: "Login",
                ...staticData
            });
        });
    })
    .post(
        passport.authenticate("local", {
            successRedirect: "/trading-success",
            failureRedirect: "/login-fail"
        }))

router
    .route("/login")
    .get((request, response) => {
        request.session.destroy(function (err) {
            response.render("login.hbs", {
                title: "Welcome to the login page.",
                display: "Login",
                ...staticData
            });
        });
    })
    .post(
        passport.authenticate("local", {
            successRedirect: "/trading-success",
            failureRedirect: "/login-fail"
        }))

router
    .route("/login-fail")
    .get((request, response) => {
        request.session.destroy(function (err) {
            response.status(200);
            response.render("login.hbs", {
                title:
                    "You have entered an invalid username or password. Please try again or create a new account.",
                display: "Login",
                ...staticData
            });
        });
    })
    .post(
        passport.authenticate("local", {
            successRedirect: "/trading-success",
            failureRedirect: "/login-fail"
        })
    )

router
    .route("/logout")
    .get((request, response) => {
        request.session.destroy(function (err) {
            response.redirect("/");
        });
    })





module.exports = router;
