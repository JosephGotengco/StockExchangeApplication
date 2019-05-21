const express = require('express');

const router = new express.Router();

router
    .route("/home")
    .get((request, response) => {
        response.render("home.hbs");
    })

router
    .route("/about")
    .get((request, response) => {
        response.render("about.hbs");
    })


module.exports = router;

