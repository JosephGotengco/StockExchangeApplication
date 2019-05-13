const express = require('express');
const passport = require("passport");

const router = new express.Router();

router
    .route("/")
    .get((request, response) => {
        request.session.destroy(function (err) {
            response.render("login.hbs", {
                title: "Welcome to the login page.",
                display: "Login"
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
                display: "Login"
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
                display: "Login"
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
