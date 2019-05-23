const express = require("express");
const bcrypt = require("bcrypt");
var validator = require("email-validator");

var utils = require("../utils");

const router = new express.Router();

var saltRounds = 10;

const sQuestions = [
	"What was the house number and street name you lived in as a child?",
	"What were the last four digits of your childhood telephone number?",
	"What primary school did you attend?",
	"In what town or city was your first full time job?",
	"In what town or city did you meet your spouse/partner?",
	"What is the middle name of your oldest child?",
	"What are the last five digits of your driver's licence number?",
	"What is your grandmother's (on your mother's side) maiden name?",
	"What is your spouse or partner's mother's maiden name?",
	"In what town or city did your mother and father meet?",
	"What time of the day were you born? (hh:mm)",
	"What time of the day was your first child born? (hh:mm)"
];

var staticData = {
	s1Questions: sQuestions.slice(0, 5),
	s2Questions: sQuestions.slice(5, 100),
	display: "Register"
}

router
	.route("/registration-logged-in")
	.get(isAuthenticated, (request, response) => {
		response.render("register-logged-in.hbs", {
			title: "You are already logged in. Logout to make a new account.",
			display: "Register"
		});
	});

router
	.route("/register")
	.get((request, response) => {
		response.render("register.hbs", { title: "To create an account please enter credentials.", ...staticData });
	})
	.post((request, response) => {
		var db = utils.getDb();

		var firstname = request.body.firstname;
		var lastname = request.body.lastname;
		var username = request.body.username;
		var email = request.body.email;
		var password = request.body.password;
		var confirm_password = request.body.confirm_password;
		var s1Q = request.body.s1Q;
		var s1A = request.body.s1A;
		var s2Q = request.body.s2Q;
		var s2A = request.body.s2A;



		var message;
		var attributes = [
			firstname,
			lastname,
			username,
			password,
			confirm_password
		];
		var check;

		if (check_str(attributes[0]) === false) {
			message = `First name must be 3-30 characters long and must only contain letters.`;
			response.render("register.hbs", {
				title: message, ...staticData
			});
		} else if (check_str(attributes[1]) === false) {
			message = `Last name must be 3-30 characters long and must only contain letters.`;
			response.render("register.hbs", {
				title: message, ...staticData
			});
		} else if (check_uniq(attributes[2]) === false) {
			message = `Username must have 5-15 characters and may only be alphanumeric.`;
			response.render("register.hbs", {
				title: message, ...staticData
			});
		}
		else if (validator.validate(email) === false) {
			message = `Email must be valid.`;
			response.render("register.hbs", {
				title: message, ...staticData
			})
		} else if (check_uniq(attributes[3]) === false) {
			message = `Password must have 5-15 characters and may only be alphanumeric.`;
			response.render("register.hbs", {
				title: message,
				...staticData
			});
		} else if (attributes[3] !== attributes[4]) {
			message = `Passwords do not match. Please try again.`;
			response.render("register.hbs", {
				title: message,
				...staticData
			});
		} else if (sQuestions.slice(0, 5).includes(s1Q) === false) {
			message = `Please pick and answer the first security question.`;
			response.render("register.hbs", {
				title: message,
				...staticData
			});
		} else if (check_uniq(s1A) === false || s1A === undefined) {
			message = `Your answer for security question #1 must have 5-15 characters and may only be alphanumeric.`;
			response.render("register.hbs", {
				title: message,
				...staticData
			});
		} else if (sQuestions.slice(5, 100).includes(s2Q) === false) {
			message = `Please pick and answer a second security question.`;
			response.render("register.hbs", {
				title: message,
				...staticData
			});
		} else if (check_uniq(s2A) === false || s2A === undefined) {
			message = `Your answer for security question #2 must have 5-15 characters and may only be alphanumeric.`;
			response.render("register.hbs", {
				title: message,
				...staticData
			});
		} else {
			check = true;
		}

		if (check) {
			bcrypt.hash(password, saltRounds, (err, hash) => {
				if (err) {
					console.error(err);
				} else {
					db.collection("user_accounts").findOne(
						{ username: username },
						function (err, result) {
							if (result === null) {
								db.collection("user_accounts").insertOne(
									{
										firstname: firstname,
										lastname: lastname,
										username: username,
										email: email,
										password: hash,
										// password: password,
										s1Q: s1Q,
										s1A: s1A,
										s2Q: s2Q,
										s2A: s2A,
										type: "standard",
										cash2: [10000],
										stocks: [],
										creation_date: new Date().toString(),
										transactions: []
									},
									(err, result) => {
										if (err) {
											messsage = `There was an error in creating your account. Please try again.`;
											response.render("register.hbs", {
												title: `There was an error in creating your account. Please try again.`,
												...staticData
											});
										}
										message = `You have successfully created an account with the username '${username}' and have been granted $10,000 USD. Head over to the login page.`;
										response.render("register.hbs", {
											title: message,
											...staticData
										});
									}
								);
							} else {
								message = `The username '${username}' already exists within the system.`;
								response.render("register.hbs", {
									title: `The username '${username}' already exists within the system.`,
									...staticData
								});
							}
						}
					);
				}
			});
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

function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		next();
	} else {
		response.redirect("/");
	}
}

module.exports = router;

