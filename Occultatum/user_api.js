var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');

// General mysql connect funtion
function connectDb(req) {
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
    var connection = connectDb(req);
    var username = req.body.username;
    var password = req.body.password;
    // Check if username and password are both available
    if (username === '' || username === undefined || password === '' || password === undefined) {
        res.status(400);
        res.json({ error: 'username and or password is empty or missing!' });
    }

    // Insert name into db when username is available
    var query = 'INSERT INTO pending (username, password) SELECT * FROM (SELECT ?,?) as tmp '
        + 'WHERE NOT EXISTS (SELECT username FROM pending WHERE username = ? UNION SELECT username from users WHERE username = ?)';
    connection.query(query, [username, password, username, username], function (err, results) {
        if (err) {
            console.log(err);
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
