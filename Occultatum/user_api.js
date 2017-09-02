var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var config = require('./config.json');

var pool = mysql.createPool(config.dbInfo);


// General mysql connect funtion
// function connectToDb(req) {
//     var connection = mysql.createConnection(config.dbInfo);
//     connection.connect(function (err) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//     });
//     return connection;
// }

// Body: {username: '',password: ''}
router.post('/createAccount', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // Check if username and password are both available
    if (!username || !password) {
        res.status(400);
        res.json({ error: 'username and or password is/are empty or missing!' });
        return;
    }
    // Hash password to be saved in database
    bcrypt.hash(password, config.saltRounds, function (err, passwordHash) {
        // Insert name and hashed password into pending table when username is available
        var query = 'INSERT INTO pending (username, password) SELECT * FROM (SELECT ?,?) as tmp '
            + 'WHERE NOT EXISTS (SELECT username FROM pending WHERE username = ? UNION SELECT username from users WHERE username = ?)';
        pool.query(query, [username, passwordHash, username, username], function (err, results) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json('An error occured');
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
    });
});

// Body {username: '', password: ''}
router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // Check if username and password are both available
    if (!username || !password) {
        res.status(400);
        res.json({ error: 'username and or password is/are empty or missing!' });
        return;
    }
    var query = 'SELECT * FROM users WHERE username = ?';
    pool.query(query, [username], function (err, results) {
        if (err) {
            res.status(500);
            res.json('An error occured');
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
                    }, config.jwtKey);
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
});

// Check on all api calls past this one for a valid jwt token
router.all('*', function (req, res, next) {
    // Array of all routes that require admin rights
    var adminRoutes = ['/updatePending', '/updateUser'];
    var adminLevel = 2;

    var token = (req.header('Acces-token') || '');
    if (token) {
        try {
            var decoded = jwt.decode(token, config.jwtKey);
            // TODO: Add token exp check etc.. as well
            // Check if jwt iss exists in database
            decodedIss = decoded.iss;

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
                    // Check if user tries to acces admin routes if it is no admin
                    if (results[0].userRights < adminLevel) {
                        for (var i = 0; i < adminRoutes.length; i++) {
                            // If path contains one of the admin routes break call to next()
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

// {username: 'string' ,"accepted": 'boolean', "userRights": "int"}
router.put('/updatePending', function (req, res) {
    var username = req.body.username;
    var accepted = req.body.accepted;
    var userRights = req.body.userRights;
    // Check if accepted && username is defined.
    if (accepted === '' || accepted === undefined || !username) {
        res.status(400);
        res.json({ error: 'accepted and/or username is/are empty or missing. userRights: (1-2) is also required when accepted = true' });
        return;
    }
    // Check if requested username exists in database
    pool.getConnection(function (err, connection) {
        var _query = 'SELECT * FROM pending where username = ?';
        connection.query(_query, [username], function (err, results) {
            // If no usernames are found, exit.
            if (results.length < 1) {
                res.status(400);
                res.json("Entered pending username doesn't exist");
                return;
            }
            // If accepted is true, check for userRights key
            if (accepted) {
                if (!userRights) {
                    res.status(400);
                    res.json({ error: 'userRights is empty or missing. userRights: (1-2) is required for accepted = true' });
                    return;
                }
                // check userRights for accepted values
                if (userRights >= 1 && userRights <= 2) {
                    var query = 'INSERT INTO users(username, password, userRights) VALUES ((SELECT username FROM pending WHERE username = ?),(SELECT password FROM pending WHERE username = ?),?);'
                        + 'DELETE FROM pending WHERE username = ?;';
                    connection.query(query, [username, username, userRights, username], function (err) {
                        if (err) {
                            res.status(500);
                            res.json('An error occured' + err);
                            return;
                        }
                        res.status(200);
                        res.json('Pending updated to user succesfully');
                    });
                } else {
                    res.status(400);
                    res.json('invalid userRights value. Accepted values are 1 and 2.');
                    return;
                }
            } else {
                // Accepted is false so userRights are not required. Delete user from pending table.
                var query2 = 'DELETE FROM pending WHERE username = ?';
                connection.query(query2, [username], function (err) {
                    if (err) {
                        res.status(500);
                        res.json('An error occured');
                        return;
                    }
                    res.status(200);
                    res.json('Pending user deleted succesfully');
                });
            }
        });
        connection.release();
    });
});

// Body: {username: 'string',newPassword: 'string', newUserRights: number}
router.put('/updateUser', function (req, res) {
    // At least on of the two 'new' keys is required. Both available is also possible.
    var username = req.body.username;
    var deleted = req.body.delete;
    var newPassword = req.body.newPassword;
    var newUserRights = req.body.newUserRights;
    // Check is username is available and if at least one of the new keys is as well.
    if (!username || (!newPassword && !newUserRights)) {
        res.status(400);
        res.json({
            error: 'username and/or newPassword or newUserRights is/are empty or missing.'
            + ' At least one new key is required.'
        });
        return;
    }
    //Check if newUserRights values are allowed
    if (newUserRights < 1 || newUserRights > 2) {
        res.status(400).json({ error: 'newUserRights value is not permitted. Allowed values are 1-2' });
        return;
    }
    var query;
    var queryValues;
    if (deleted) {
        query = 'DELETE FROM users WHERE username = ?';
        queryValues = [username];
    }
    else if (newPassword && newUserRights) {
        query = 'UPDATE users SET password = ?, userRights = ? WHERE username = ?';
        var hash = bcrypt.hashSync(newPassword, config.saltRounds);
        queryValues = [hash, newUserRights, username];
    } else if (newPassword) {
        query = 'UPDATE users SET password = ? WHERE username = ?';
        var hash2 = bcrypt.hashSync(newPassword, config.saltRounds);
        queryValues = [hash2, username];
    } else if (newUserRights) {
        query = 'UPDATE users SET userRights = ? WHERE username = ?';
        queryValues = [newUserRights, username];
    }

    pool.query(query, queryValues, function (err, results) {
        if (err) {
            res.status(500);
            res.json('An error occured');
            return;
        }
        if (results.affectedRows < 1) {
            res.status(400).json('Updated user does not exist');

        } else {
            res.status(200).json('User updated succesfully');
        }
    });
});

module.exports = router;
