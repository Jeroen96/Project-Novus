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
                    res.json('Authorisation failed: invalid password.');
                }
            });
        } else {
            res.status(404);
            res.json('User not found');
        }
    });
    connection.end();
});

// Check on all api calls past this one for a valid jwt token
router.all('*', function (req, res, next) {
    var connection = connectToDb(req);
    var token = (req.header('Acces-token') || '');
    if (token) {
        try {
            var decoded = jwt.decode(token, req.app.get('config').jwtKey);
            // TODO: Add token exp check etc.. as well
            // Check if jwt iss exists in database
            decodedIss = decoded.iss;
            decodedUsr = decoded.usr;

            var query = 'SELECT * FROM users WHERE username = ?';
            connection.query(query, [decodedIss], function (err, results) {
                // If name from token exists in db do..
                if (results.length > 0) {
                    req.app.set('iss', decodedIss);
                    req.app.set('usr', decodedUsr);
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
    connection.end();
});

router.get('/test', function (req, res) {
    res.send('Hello World!');
});

module.exports = router;
