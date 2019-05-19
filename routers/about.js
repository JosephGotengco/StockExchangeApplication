const express = require('express');

const router = new express.Router();

router
    .route("/about")
    .get(isAuthenticated, (request, response) => {
        response.render("about.hbs");
    })

function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		next();
	} else {
		response.redirect("/");
	}
}

module.exports = router;

