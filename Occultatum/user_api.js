var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

// General mysql connect funtion
function connectToDb(req) {
    var config = req.app.get('config');
    var connection = mysql.createConnection(config.dbInfo);
    connection.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
    });
    return connection;
}

// Body: {username: '',password: ''}
router.post('/createAccount', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // Check if username and password are both available
    if (username === '' || username === undefined || password === '' || password === undefined) {
        res.status(400);
        res.json({ error: 'username and or password is/are empty or missing!' });
        return;
    }
    // Hash password to be saved in database
    var connection = connectToDb(req);
    bcrypt.hash(password, req.app.get('config').saltRounds, function (err, passwordHash) {
        // Insert name and hashed password into pending table when username is available
        console.log(passwordHash);
        var query = 'INSERT INTO pending (username, password) SELECT * FROM (SELECT ?,?) as tmp '
            + 'WHERE NOT EXISTS (SELECT username FROM pending WHERE username = ? UNION SELECT username from users WHERE username = ?)';
        connection.query(query, [username, passwordHash, username, username], function (err, results) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json('An error occured');
                connection.end();
                return;
            }
            if (results.affectedRows > 0) {
                res.status(201);
                res.json('Account created');
            } else {
                res.status(409);
                res.json('Account name already exists');
            }
        });
        connection.end();
    });
});

// Body {username: '', password: ''}
router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // Check if username and password are both available
    if (username === '' || username === undefined || password === '' || password === undefined) {
        res.status(400);
        res.json({ error: 'username and or password is/are empty or missing!' });
        return;
    }
    var connection = connectToDb(req);
    var query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], function (err, results) {
        if (err) {
            res.status(500);
            res.json('An error occured');
            connection.end();
            return;
        }
        // If given username exists in db check password hash with given password
        if (results.length > 0) {
            var hashResult = results[0].password;
            var userRights = results[0].userRights;
            bcrypt.compare(password, hashResult, function (err, result) {
                // Password hash matches password, return jwt token
                if (result) {
                    var token = jwt.encode({
                        'iss': username,
                        'usr': userRights
                    }, req.app.get('config').jwtKey);
                    res.status(200);
                    res.json({ 'token': token });
                } else {
                    res.status(401);
                    res.json('Authorisation failed');
                }
            });
        } else {
            res.status(404);
            res.json('User not found');
        }
    });
    connection.end();
});

// TODO: Add token checking middleware after this line

// // add user to pending table
// var query = 'SELECT * FROM users WHERE username = ?';
// connection.query(query, [receivedUsername], function (err, results, fields) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     res.send(results);
// });
// connection.end(function () { });
// });


// Alle endpoint behalve /userApi/login require Access-Token
// router.all(new RegExp('[^(\/login)]'), function (req, res, next) {
//     var token = (req.header('Access-Token')) || '';
//     if (token) {
//         try {
//             // Decode jwt and fetch the requester's username
//             var decoded = jwt.decode(token, req.app.get('config').jwtKey);
//             var receivedUsername = decoded.iss;
//             var userName = '';
//             // create database connetion
//             var connection = connectDb(req);

//             var query = 'SELECT * FROM gebruiker WHERE gebruikersnaam = ?';
//             connection.query(query, [receivedUsername], function (err, results, fields) {
//                 if (err) {
//                     console.log(err);
//                     return;
//                 }
//                 userName = results[0].gebruikersnaam;

//                 if (decoded.iss === userName) {
//                     req.app.set('userid', decoded.iss);
//                     return next();
//                 }
//                 else {
//                     res.status(401);
//                     res.json({
//                         'status': 401, 'message': 'unknown user, bye'
//                     });
//                 }
//             });
//             connection.end(function (err) {
//             });
//         }
//         catch (err) {
//             console.log('Authorization failed: ' + err);
//             res.status(401);
//             res.json({
//                 'status': 401, 'message': 'unknown user, bye'
//             });
//         }
//     }
//     else {
//         res.status(401);
//         res.json({
//             'status': 401, 'message': 'unknown user, bye'
//         });
//     }
// });

module.exports = router;
