const express = require('express');

const router = new express.Router();


router
    .route("*")
    .get(errorPage, (request, response) => {
        response.status(400);
        response.render("404.hbs", {
            title: `Sorry the URL 'localhost:8080${request.url}' does not exist.`,
            display: "Error"
        });
    })


function errorPage(request, response, next) {
	if (request.session.passport !== undefined) {
		next();
	} else {
		response.status(400);
		response.render("404x.hbs", {
			title: `Sorry the URL 'localhost:8080${request.url}' does not exist.`,
			display: "Error"
		});
	}
}


module.exports = router;