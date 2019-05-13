const express = require('express');
var mongoose = require("mongoose");
var assert = require("assert");

const router = new express.Router();


router
    .route("/admin")
    .get((request, response) => {
        response.render("admin-restricted-not-logged-in.hbs", {
            title:
                "You are not authorized to view this page. Please log in with an administrator account.",
            display: "Admin"
        });
    })

router
    .route("/admin-restricted")
    .get(isAuthenticated, (request, response) => {
        response.render("admin-restricted.hbs", {
            title:
                "You are not authorized to view this page. Go back to the Trading page.",
            display: "Admin"
        });
    })

router
    .route("/admin-success")
    .get(isAdmin, (request, response) => {
        mongoose.connect("mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts", function (err, db) {
            assert.equal(null, err);
            db.collection("user_accounts")
                .find()
                .toArray(function (err, result) {
                    if (err) {
                        response.send("Unable to fetch Accounts");
                    }
                    response.render("admin-success.hbs", {
                        title: "Welcome to the Admin page",
                        result: result,
                        display: "Admin"
                    });
                });
            db.close;
        });
    })

router
    .route("/admin-success-user-accounts")
    .post(isAdmin, (request, response) => {
        mongoose.connect("mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts", function (err, db) {
            assert.equal(null, err);
            db.collection("user_accounts")
                .find()
                .toArray(function (err, result) {
                    if (err) {
                        response.send("Unable to fetch Accounts");
                    }
                    response.render("admin-success.hbs", {
                        result: result,
                        display: "Admin"
                    });
                });
            db.close;
        });
    })

router
    .route("/admin-success-delete-user-success")
    .post(isAdmin, (request, response) => {
        var user_name_to_delete = request.body.user_id;
        var username = request.session.passport.user.username;

        if (user_name_to_delete == username) {
            response.render("admin-success.hbs", {
                message: "Cannot delete your own account!"
            });
            return;
        } else {
            if (user_name_to_delete == "") {
                response.render("admin-success.hbs", {
                    message: "Cannot be empty"
                });
            } else {
                message = "";
                mongoose.connect("mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts", function (err, db) {
                    assert.equal(null, err);

                    var query = { username: user_name_to_delete };

                    db.collection("user_accounts")
                        .find(query)
                        .toArray(function (err, result) {
                            if (err) {
                                message = "Unable to Delete Account";
                                response.render("admin-success.hbs", {
                                    message: message,
                                    display: "Admin"
                                });
                            }
                            if (result === undefined || result.length == 0) {
                                message = "No user exists with that username";
                                response.render("admin-success.hbs", {
                                    message: message,
                                    display: "Admin"
                                });
                            } else {
                                db.collection("user_accounts").deleteOne(query, function (
                                    err,
                                    obj
                                ) {
                                    if (err) throw err;
                                    message = "User is Deleted";
                                    response.render("admin-success.hbs", {
                                        message: message,
                                        display: "Admin"
                                    });
                                    db.close;
                                });
                            }
                        });
                });
            }
        }
    })

router
    .route("/admin-update")
    .post(isAdmin, (request, response) => {
        try {
            var username = request.body.user_id;
            // Need to apply argument checks to these guys
            var newBal = parseFloat(request.body.newBal);
            var newFN = request.body.firstName;
            var newLN = request.body.lastName;
            // var newPass = request.body.password;
            var findQuery = { username: username };
            var updateQuery = {
                $set: { firstname: newFN, lastname: newLN, cash2: [newBal] }
            };

            var message;

            if (check_str(newFN) === false) {
                message = `First name must be 3-30 characters long and must only contain letters.`;
                response.render("admin-success.hbs", {
                    message: message,
                    display: "Admin"
                });
            } else if (check_str(newLN) === false) {
                message = `Last name must be 3-30 characters long and must only contain letters.`;
                response.render("admin-success.hbs", {
                    message: message,
                    display: "Admin"
                });
            } else if (username === "" || username === undefined) {
                response.render("admin-success.hbs", {
                    message: "Cannot be empty",
                    display: "Admin"
                });
            } else if (newBal < 0 || newBal === undefined) {
                message = `You cannot set the user, ${username}, to below $0.`;
                response.render("admin-success.hbs", {
                    message: message,
                    display: "Admin"
                });
            } else {
                mongoose.connect("mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts", function (err, db) {
                    assert.equal(null, err);
                    db.collection("user_accounts")
                        .find(findQuery)
                        .toArray(function (err, result) {
                            if (err) {
                                message = "Unable to Update Account";
                                response.render("admin-success.hbs", {
                                    message: message
                                });
                            }
                            if (result === undefined || result.length == 0) {
                                message = "No user exists with that username";
                                response.render("admin-success.hbs", {
                                    message: message
                                });
                            } else {
                                db.collection("user_accounts").updateOne(
                                    findQuery,
                                    updateQuery,
                                    { upsert: false },
                                    function (err, result) {
                                        if (err) throw err;
                                        request.session.passport.user.cash2[0] = newBal;
                                        message = `The user, ${username}, now has the balance of $${newBal}`;
                                        response.render("admin-success.hbs", {
                                            message: message,
                                            display: "Admin"
                                        });

                                        db.close;
                                    }
                                );
                            }
                        });
                });
            }
        } catch (e) {
            console.log(e);
            response.render("admin-success.hbs")
        }
    })

function check_str(string_input) {
    // checks if string value is between 3 and 12 characters, uses RegEx to confirm only alphabetical characters
    var valid_chars = /^[a-zA-Z ]{3,30}$/;
    var string_length = string_input.length;

    if (valid_chars.test(string_input)) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
}

function isAuthenticated(request, response, next) {
    if (request.session.passport !== undefined) {
        next();
    } else {
        response.redirect('/');
    }
}

function isAdmin(request, response, next) {
    if (
        request.session.passport !== undefined &&
        request.session.passport.user.type === "admin"
    ) {
        next();
    } else {
        response.redirect("/admin-restricted");
    }
}


module.exports = router;