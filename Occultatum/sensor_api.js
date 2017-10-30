var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

// Check if requesting user is a sensor
router.all('*', function (req, res, next) {
    // Array of all routes that require admin rights
    var adminRoutes = ['/updatePending', '/updateUser'];
    var adminLevel = 2;

    var token = (req.header('Acces-token') || '');
    if (token) {
        try {
            var decoded = jwt.decode(token, config.jwtKey);
            var decodedIss = decoded.iss;
            // Check if jwt iss exists in database
            var query = 'SELECT * FROM users WHERE username = ?';
            pool.query(query, [decodedIss], function (err, results) {
                if (err) {
                    res.status(500);
                    res.json('An error occured');
                    return;
                }
                // If name from token exists in db do..
                if (results.length > 0) {
                    req.app.set('iss', decodedIss);
                    req.app.set('usr', results[0].userRights);
                    // Check if user tries to acces admin routes if it is no admin else next()
                    if (results[0].userRights < adminLevel) {
                        for (var i = 0; i < adminRoutes.length; i++) {
                            // If path contains one of the admin routes return error
                            if (req.path.includes(adminRoutes[i])) {
                                res.status(403);
                                res.json('requested path is forbidden');
                                return;
                            }
                        }
                    }
                    next();
                } else {
                    res.status(401);
                    res.json('Acces denied. User unknown');
                }
            });
        } catch (err) {
            res.status(400);
            res.json('Authorization failed. ' + err);
        }
    } else {
        res.status(400);
        res.send('No token supplied for the Acces-token header');
    }
});


module.exports = router;
