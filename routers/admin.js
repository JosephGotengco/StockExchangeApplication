const express = require("express");
var mongoose = require("mongoose");
var assert = require("assert");
var utils = require("../utils");
// function for converting monetary values
var convert = require("../feature_functions/getRates");
// function for retrieving symbols for currency codes
const rate_symbols = require("../feature_functions/rate_symbols");
const router = new express.Router();

router.route("/test").post(isAuthenticated, async (request, response) => {
    try {
        var ssn = request.session.passport.user;

        var rates = await convert();
        var preference = ssn.currency_preference;
        var rate = rates[preference];

        var data = JSON.stringify(request.body);
        var data = JSON.parse(data);
        var updated_users = data.updated_users;
        // console.log(updated_users);
        var flags = [];
        for (i = 0; i < updated_users.length; i++) {
            var user = updated_users[i];
            var username = user.username;
            var firstname = user.firstname;
            var lastname = user.lastname;
            var cash2 = user.cash2;
            cash2[0] = cash2[0] / rate;
            var type = user.type;
            // console.log(`username: ${username}`);
            // console.log(`firstname: ${firstname}`);
            // console.log(`lastname: ${lastname}`);
            // console.log(`cash2: ${cash2}`);
            // console.log(`type: ${type}`);
            // VALIDATION
            if (check_str(firstname) === false) {
                // do something
                // console.log("hit 1");
                var msg = `first name must be 3-30 characters long and must only contain letters.`;
                flags.push({ username: username, msg: msg });
            } else if (check_str(lastname) === false) {
                // do something
                // console.log("hit 2");
                var msg = `last name must be 3-30 characters long and must only contain letters.`;
                flags.push({ username: username, msg: msg });
            } else if (typeof cash2[0] !== "float" && typeof cash2[0] !== "number") {
                // do something
                // console.log("hit 3");
                var msg = `cash must be a float or a number.`;
                flags.push({ username: username, msg: msg });
            } else if (cash2[0] < 0) {
                // do something
                // console.log("hit 4");
                var msg = `cash cannot be below 0.`;
                flags.push({ username: username, msg: msg });
            } else if (check_str(type) === false) {
                // do something
                // console.log("hit 5");
                var msg = `user type must either be the string standard or admin.`;
                flags.push({ username: username, msg: msg });
            } else if (type !== "admin" && type !== "standard") {
                // do something
                // console.log("hit 6");
                var msg = `user type must either be the string standard or admin.`;
                flags.push({ username: username, msg: msg });
            } else {
                // console.log("pass");
                var msg = `was successfully updated.`;
                flags.push({ username: username, msg: msg });
                // UPDATE DATABASE
                var db = utils.getDb();

                var query = { username: username };

                var update_result = await db
                    .collection("user_accounts")
                    .updateOne(query, {
                        $set: {
                            firstname: firstname,
                            lastname: lastname,
                            cash2: cash2,
                            type: type
                        }
                    });

                // console.log(update_result);
            }
        }

        db.collection("user_accounts")
            .find()
            .toArray((err, result) => {
                if (err) {
                    flags.push({ username: username, msg: "could not be updated." });
                } else {
                    // console.log("---------------------ARRAY++++++++++++++++++=");
                    // console.log(result[result.length - 1]);

                    var data = {
                        flags: flags,
                        result: result
                    };
                    data.result.forEach((val, i) => {
                        val.cash2[0] = val.cash2[0] * rate;
                    });

                    response.status(200);
                    response.contentType("json");
                    response.send(data);
                }
            });
        db.close;
    } catch (e) {
        console.log(e);
    }
});

router.route("/admin").get((request, response) => {
    response.render("admin-restricted-not-logged-in.hbs", {
        title:
            "You are not authorized to view this page. Please log in with an administrator account.",
        display: "Admin"
    });
});

router
    .route("/admin-restricted")
    .get(isAuthenticated, (request, response) => {
        response.render("admin-restricted.hbs", {
            title:
                "You are not authorized to view this page. Go back to the Trading page.",
            display: "Admin"
        });
    })
    .post(isAuthenticated, (request, response) => {
        var ssn = request.session.passport.user;
        ssn.currency_preference = request.body.currency_preference;

        var db = utils.getDb();

        db.collection("user_accounts")
            .find()
            .toArray(async (err, result) => {
                if (err) {
                    response.send("Unable to fetch Accounts");
                }

                var rates = await convert();
                var preference = ssn.currency_preference;
                var rate = rates[preference];
                var currency_symbol = rate_symbols.getCurrencySymbol(preference);

                result.forEach((val, i) => {
                    val.cash2[0] = (val.cash2[0] * rate).toFixed(2);
                });

                response.render("admin-restricted.hbs", {
                    title:
                        "You are not authorized to view this page. Go back to the Trading page.",
                        result: result,
                        display: "Admin",
                        currency_symbol: currency_symbol,
                        currency_preference: ssn.currency_preference
                });
            });
        db.close;
    });

router
    .route("/admin-success")
    .get(isAdmin, (request, response) => {
        var ssn = request.session.passport.user;

        var db = utils.getDb();

        db.collection("user_accounts")
            .find()
            .toArray(async (err, result) => {
                if (err) {
                    response.send("Unable to fetch Accounts");
                }

                var rates = await convert();
                var preference = ssn.currency_preference;
                var rate = rates[preference];
                var currency_symbol = rate_symbols.getCurrencySymbol(preference);

                result.forEach((val, i) => {
                    val.cash2[0] = val.cash2[0] * rate;
                });

                response.render("admin-success.hbs", {
                    title: "Welcome to the Admin page",
                    result: result,
                    display: "Admin",
                    currency_symbol: currency_symbol,
                    currency_preference: ssn.currency_preference
                });
            });
        db.close;
    })
    .post(isAdmin, (request, response) => {
        var ssn = request.session.passport.user;
        ssn.currency_preference = request.body.currency_preference;

        var db = utils.getDb();

        db.collection("user_accounts")
            .find()
            .toArray(async (err, result) => {
                if (err) {
                    response.send("Unable to fetch Accounts");
                }

                var rates = await convert();
                var preference = ssn.currency_preference;
                var rate = rates[preference];
                var currency_symbol = rate_symbols.getCurrencySymbol(preference);

                result.forEach((val, i) => {
                    val.cash2[0] = (val.cash2[0] * rate).toFixed(2);
                });

                response.render("admin-success.hbs", {
                    title: "Welcome to the Admin page",
                    result: result,
                    display: "Admin",
                    currency_symbol: currency_symbol,
                    currency_preference: ssn.currency_preference
                });
            });
        db.close;
    });

router
    .route("/admin-success-user-accounts")
    .post(isAdmin, (request, response) => {
        var db = utils.getDb();

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

router
    .route("/admin-success-delete-user-success")
    .post(isAdmin, (request, response) => {
        request.body = JSON.stringify(request.body);
        request.body = JSON.parse(request.body);
        // console.log(request.body);

        var user_name_to_delete = request.body.user_id;
        var username = request.session.passport.user.username;

        if (user_name_to_delete == username) {
            var message = "Cannot delete your own account!";
            // response.render("admin-success.hbs", {
            //     message: "Cannot delete your own account!"
            // });
            response.status(200);
            response.contentType("json");
            response.send({
                msg: message
            });
            return;
        } else {
            if (user_name_to_delete == "") {
                var message = "Cannot be empty";
                // response.render("admin-success.hbs", {
                //     message: "Cannot be empty"
                // });
                response.status(200);
                response.contentType("json");
                response.send({
                    msg: message
                });
            } else {
                message = "";
                var db = utils.getDb();

                var query = { username: user_name_to_delete };

                db.collection("user_accounts")
                    .find(query)
                    .toArray(function (err, result) {
                        if (err) {
                            message = "Unable to Delete Account";
                            // response.render("admin-success.hbs", {
                            //     message: message,
                            //     display: "Admin"
                            // });
                            response.status(200);
                            response.contentType("json");
                            response.send({
                                msg: message
                            });
                        }
                        if (result === undefined || result.length == 0) {
                            message = "No user exists with that username";
                            // response.render("admin-success.hbs", {
                            //     message: message,
                            //     display: "Admin"
                            // });
                            response.status(200);
                            response.contentType("json");
                            response.send({
                                msg: message
                            });
                        } else {
                            db.collection("user_accounts").deleteOne(query, function (
                                err,
                                obj
                            ) {
                                if (err) throw err;
                                message = "User is Deleted";
                                response.status(200);
                                response.contentType("json");
                                response.send({
                                    msg: message
                                });
                                // response.render("admin-success.hbs", {
                                //     message: message,
                                //     display: "Admin"
                                // });
                                db.close;
                            });
                        }
                    });
            }
        }
    });

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
        response.redirect("/");
    }
}

function clone(src) {
    return JSON.parse(JSON.stringify(src));
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
