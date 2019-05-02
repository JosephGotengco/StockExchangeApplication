const express = require('express');

const router = new express.Router();
var utils = require('../utils');

router
.route('/registration-logged-in')
.get(isAuthenticated, (request, response) => {
// End point if user goes to registeration webpage but is already logged in
	response.render('registration-logged-in.hbs', {
		title: 'You are already logged in. Logout to make a new account.'
	})
})




router
.route("/register")
.get((request, response) => {
// End point for a new user
	response.render('registration.hbs', {
		title: 'To create an account please enter credentials.'
	})
})
.post((request, response) => {
// Post end point for registering a new user

	var firstname = request.body.firstname;
	var lastname = request.body.lastname;
	var username = request.body.username;
	var password = request.body.password;
	var message;
	var confirm_password = request.body.confirm_password;
	var db = utils.getDb();
	var attributes = [firstname, lastname, username, password, confirm_password];
	var check;

	if (check_str(attributes[0]) === false) {
		message = `First name must be 3-30 characters long and must only contain letters.`;
		response.render('registration.hbs', {title: message});
	}
	else if (check_str(attributes[1]) === false) {
		message = `Last name must be 3-30 characters long and must only contain letters.`;
		response.render('registration.hbs', {title: message});
	}
	else if (check_uniq(attributes[2]) === false) {
		message = `Username must have 5-15 characters and may only be alphanumeric.`;
		response.render('registration.hbs', {title: message});
	}
	else if (check_uniq(attributes[3]) === false) {
		message = `Password must have 5-15 characters and may only be alphanumeric.`;
		response.render('registration.hbs', {title: message});
	}
	else if ((attributes[3]) !== attributes[4]) {
		message = `Passwords do not match. Please try again.`;
		response.render('registration.hbs', {title: message});
	}
	else {
		check = true;
	}

	if (check) {
		db.collection('user_accounts').findOne({username: username}, function(err, result) {

			if (result === null) {
				db.collection('user_accounts').insertOne({
					firstname: firstname,
					lastname: lastname,
					username: username,
					password: password,
					type: 'standard',
					cash2: [10000],
					stocks: []

				}, (err, result) => {
					if (err) {
						messsage = `There was an error in creating your account. Please try again.`;
						response.render('registration.hbs', {title: `There was an error in creating your account. Please try again.`});
					}
					message = `You have successfully created an account with the username '${username}' and have been granted $10,000 USD. Head over to the login page.`;
					response.render('registration.hbs', {title: message});
				});
			}
			else {
				message = `The username '${username}' already exists within the system.`;
				response.render('registration.hbs', {title: `The username '${username}' already exists within the system.`});
			}
		}

	)};
})



function check_str (string_input) {
	// checks if string value is between 3 and 12 characters, uses RegEx to confirm only alphabetical characters
	var valid_chars = /^[a-zA-Z ]{3,30}$/;
	var string_length = string_input.length;

	if (valid_chars.test(string_input)) {
		flag = true;
	}
	else {
		flag = false;
	}
	return flag;
}

function check_uniq (string_input) {
	// checks if string value is between 5 and 15 characters, uses RegEx to confirm only alphanumerical chars
	var valid_chars = /^([a-zA-Z0-9_-]){5,15}$/;

	if (valid_chars.test(string_input)) {
		flag = true;
	}
	else {
		flag = false;
	}
	return flag;
}



function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		console.log(request.session.passport);
		next();
	} else {
		response.redirect('/');
	}
}

module.exports = router;