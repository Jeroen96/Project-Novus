var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

router.get('/kappa', function (req, res) {
    console.log(req.baseUrl);
    res.send('kappa');
});

module.exports = router;
