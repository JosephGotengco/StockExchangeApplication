const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
var fs = require("fs");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
var async = require("async");
var crypto = require("crypto");
var utils = require("../utils");

var saltRounds = 10;

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
    s1Questions: sQuestions.slice(0, 5),
    s2Questions: sQuestions.slice(5, 100)
};

var logIP = (request, response, next) => {
    var time = new Date().toString();
	var log_entry = `${time}: ${request.method} ${request.url} ${request.ip}`;
	fs.appendFile("login.log", log_entry + "\n", error => {
		if (error) {
			console.log("Unable to log message");
		}
	});
	next();
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
    .post(logIP,
        passport.authenticate("local", {
            successRedirect: "/trading-success",
            failureRedirect: "/login-fail"
        })
    );

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
    .post(logIP,
        passport.authenticate("local", {
            successRedirect: "/trading-success",
            failureRedirect: "/login-fail"
        })
    );

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
    .post(logIP,
        passport.authenticate("local", {
            successRedirect: "/trading-success",
            failureRedirect: "/login-fail"
        })
    );

router.route("/logout").get((request, response) => {
    request.session.destroy(function (err) {
        response.redirect("/");
    });
});

router
    .route("/reset/password")
    .get((request, response) => {
        response.render("password-reset.hbs");
    })
    .post(async (request, response) => {
        var ip_address = request.ip;
        console.log(ip_address);
        var data = JSON.stringify(request.body);
        var data = JSON.parse(data);
        var username = data.recoveryUsername;
        if (username === "") {
            msg = `You cannot leave the username field blank.`;
        } else {
            var db = utils.getDb();
            db.collection("user_accounts").findOne({ username: username }, function (
                err,
                result
            ) {
                if (err) {
                    console.log(err);
                } else {
                    if (result === null) {
                        // do nothing
                    } else {
                        async.waterfall([
                            function (done) {
                                crypto.randomBytes(20, function (err, buf) {
                                    var token = buf.toString("hex");
                                    done(err, token);
                                });
                            },
                            function (token, done) {
                                db.collection("user_accounts").findOneAndUpdate(
                                    { email: result.email },
                                    {
                                        $set: {
                                            reset_password_token: token,
                                            reset_password_expires: Date.now() + 1000 * 60 * 60
                                        }
                                    },
                                    function (err, new_user) {
                                        done(err, token, new_user);
                                    }
                                );
                            },
                            function (token, user, done) {
                                (email =
                                    process.env.MAILER_EMAIL_ID || "StockNameTeam@gmail.com"),
                                    (pass = process.env.MAILER_PASSWORD || "stockNameIsBetter");
                                var transporter = nodemailer.createTransport({
                                    service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
                                    auth: {
                                        user: email,
                                        pass: pass
                                    }
                                });

                                const handlebarOptions = {
                                    viewEngine: {
                                        extName: '.hbs',
                                        partialsDir: 'views/partials',
                                        layoutsDir: 'views',
                                        defaultLayout: 'forgot-password-email.hbs',
                                    },
                                    viewPath: 'views',
                                    extName: '.hbs',
                                };

                                transporter.use('compile', hbs(handlebarOptions));

                                var mailOptions = {
                                    to: result.email,
                                    from: "StockNameTeam@gmail.com",
                                    template: 'forgot-password-email',
                                    subject: "Password Reset",
                                    context: {
                                        url:
                                            "http://localhost:8080/reset/password/auth/" +
                                            token,
                                        name: user.value.username
                                    }
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("Email sent: " + info.response);
                                        done(err);
                                    }
                                });
                            }
                        ]);
                    }
                }
            });
        }
        // console.log(data);
        response.status(200);
        response.contentType("json");
        response.send({ msg: "Email has been sent." });
    });

router
    .route("/reset/password/auth/:token")
    .get((request, response) => {
        console.log(request.params.token);
        response.render("password-recovery.hbs");
    })
    .post((request, response) => {
        var data = JSON.stringify(request.body);
        var data = JSON.parse(data);
        var msg;
        console.log(data);
        var token = data.token;

        response.status(200);
        response.contentType("json");

        var db = utils.getDb();
        db.collection("user_accounts").findOne({ reset_password_token: token }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result === null) {
                    console.log(result);
                } else {
                    if (result.reset_password_expires - Date.now() < 60 * 60 * 1000) {
                        var new_password = data.new_password;
                        var new_confirm_password = data.new_confirm_password;
                        if (new_password !== new_confirm_password) {
                            msg = `The passwords do not match.`;
                            var response_data = {
                                msg: msg
                            }
                            response.send(response_data);
                        } else if (check_uniq(new_password) === false) {
                            msg = `Password must have 5-15 characters and may only be alphanumeric.`;
                            var response_data = {
                                msg: msg
                            }
                        } else {
                            bcrypt.hash(new_password, saltRounds, (err, hash) => {
                                if (err) {
                                    msg = `There was an error changing your password. Please try again.`;
                                    var response_data = {
                                        msg: msg
                                    }
                                    response.send(response_data);
                                    console.error(err);
                                } else {
                                    db.collection("user_accounts").findOneAndUpdate(
                                        { reset_password_token: token },
                                        {
                                            $set: {
                                                password: hash
                                            }
                                        });
                                    msg = `Your password has been successfully updated.`;
                                    var response_data = {
                                        msg: msg
                                    }
                                    response.send(response_data);
                                }
                            });
                        }
                    } else {
                        console.log("Hour has passed");
                        msg = `The password reset token associated with the email is no longer valid. Please request for a new password reset email.`;
                        var response_data = {
                            msg: msg
                        }
                        response.send(response_data);
                    }
                }
            }
        });
    });

function check_uniq(string_input) {
    // checks if string value is between 5 and 15 characters, uses RegEx to confirm only alphanumerical chars
    var valid_chars = /^([a-zA-Z0-9:_-]){5,15}$/;

    if (valid_chars.test(string_input)) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
}


module.exports = router;
