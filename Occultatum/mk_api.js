/**
 * Created by Jeroen on 24-4-2017.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var mysql = require('mysql');


var pulsen = createJson();


function createJson() {
    var jsonObject = [];

    var jeroenObject = {
        gebruikersnaam: 'Jeroen',
        pulsen: 0
    };

    jsonObject.push(jeroenObject);
    return jsonObject;
};

interval = setInterval(function () {
    var huidigepulsen = JSON.parse(JSON.stringify(pulsen));

    for (var idx = 0; idx < pulsen.length; idx++) {
        pulsen[idx].pulsen = 0;
    }

    for (var idy = 0; idy < huidigepulsen.length; idy++) {
        stuurMeetwaarden(huidigepulsen[idy].gebruikersnaam, huidigepulsen[idy].pulsen);
    }

}, 60000);

function stuurMeetwaarden(gebruikersnaam, waarde) {
    var tijdstip = new Date();
    var userid = -1;

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'api',
        password: 'Kappa1234!',
        database: 'meterkast'
    });

    connection.connect(function (err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
            return;
        }
    });

    var usernamequery = 'SELECT id FROM gebruiker WHERE gebruikersnaam = ?';
    connection.query(usernamequery, [gebruikersnaam], function (err, results, fields) {
        if (err) {
            console.log(err);
            return;
        }
        userid = results[0].id;

        var addquery = 'INSERT INTO meetwaarden(gebruikersid, waarde, tijdstip) VALUES(?,?,?)';
        connection.query(addquery, [userid, waarde, tijdstip], function (err, results, fields) {
            if (err) {
                console.log(err);
                return;
            }

        });
        connection.end(function (err) {
        });
    });
}

// Alle endpoint behalve /api/login require Access-Token
router.all(new RegExp('[^(\/login)]'), function (req, res, next) {

    // For all the others
    var token = (req.header('Access-Token')) || '';
    if (token) {
        try {
            var decoded = jwt.decode(token, req.app.get('secretkey'));

            var receivedUsername = decoded.iss;
            var userName = '';

            var connection = mysql.createConnection({
                host: 'localhost',
                user: 'api',
                password: 'Kappa1234!',
                database: 'meterkast'
            });

            connection.connect(function (err) {
                if (err) {
                    console.log('error connecting: ' + err.stack);
                    return;
                }
            });

            var query = 'SELECT * FROM gebruiker WHERE gebruikersnaam = ?';
            connection.query(query, [receivedUsername], function (err, results, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                userName = results[0].gebruikersnaam;

                if (decoded.iss === userName) {
                    req.app.set('userid', decoded.iss);
                    return next();
                }
                else {
                    res.status(401);
                    res.json({
                        'status': 401, 'message': 'unknown user, bye'
                    });
                }
            });
            connection.end(function (err) {
            });
        }
        catch (err) {
            console.log('Authorization failed: ' + err);
            res.status(401);
            res.json({
                'status': 401, 'message': 'unknown user, bye'
            });
        }
    }
    else {
        res.status(401);
        res.json({
            'status': 401, 'message': 'unknown user, bye'
        });
    }
});

// Restfull login
router.post('/login', function (req, res) {

    var username = req.body.gebruikersnaam || '';
    var password = req.body.wachtwoord || '';

    var loginName = '';
    var loginPass = '';

    // Check for empy body
    if (username === '' || password === '') {
        res.status(401);
        res.json({
            'status': 401,
            'message': 'Unknown USER, bye'
        });
        return;
    }

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'api',
        password: 'Kappa1234!',
        database: 'meterkast'
    });

    connection.connect(function (err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
            return;
        }
    });
    var query = 'SELECT * FROM gebruiker WHERE gebruikersnaam = ? AND wachtwoord = ?';
    connection.query(query, [username, password], function (err, results, fields) {
        if (err) {
            console.log(err);
            return;
        }
        if (results.length > 0) {
            loginName = results[0].gebruikersnaam;
            loginPass = results[0].wachtwoord;
        }

        // Check for valid user/passwd combo
        if ((username === loginName) && (password === loginPass)) {
            var token = jwt.encode({
                iss: username
            }, req.app.get('secretkey'));

            res.status(200);
            res.json({
                token: token,
                user: username
            });
        }
        else {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Unknown user, bye'
            });
        }
    });
    connection.end(function (err) {
    });
});

router.post('/getData', function (req, res) {
    var type = req.body.type || '';
    var count = req.body.count || '';
    var acceptedTypes = ['day', 'hour'];
    var accepted = false;
    var data = [];


    //Check for empty body
    if (type === '' || count === '') {
        res.status(401);
        res.json({
            'status': 401,
            'message': 'POST body contains at least one empty field'
        });
        return;
    }

    //Check type body with accepted types
    for (var i = 0; i < acceptedTypes.length; i++) {
        if (type.match(acceptedTypes[i])) {
            accepted = true;
        }
    }
    //Respond if unaccepted
    if (!accepted) {
        res.status(403);
        res.json({
            'status': 403,
            'message': 'POST body contains forbidden type',
            'allowed types': acceptedTypes
        });
        return;
    }

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'api',
        password: 'Kappa1234!',
        database: 'meterkast',
        timezone: '+00:00'
    });

    connection.connect(function (err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
            return;
        }
    });

    //Fetch data for all 3 users
    for (var idx = 1; idx < 4; idx++) {
        (function (index) {
            var query = '';
            switch (type) {
                case 'hour':
                    query = "SELECT waarde,DATE_FORMAT(tijdstip, '%Y-%m-%d %H:%i') as tijdstip FROM meetwaarden WHERE tijdstip >= date_sub(now(),interval ? hour) AND gebruikersid = ?";
                    break;
                case 'day':
                    query = "SELECT waarde,DATE_FORMAT(tijdstip, '%Y-%m-%d %H:%i') as tijdstip FROM meetwaarden WHERE tijdstip >= date_sub(now(),interval ? day) AND gebruikersid = ?";
                    break;
            }
            connection.query(query, [count, index], function (err, results, fields) {
                if (err) {
                    console.log(err);
                    return;
                }

                var dataObject = {
                    userId: index,
                    results: results
                };
                data.push(dataObject);

                //respond if all users are queried
                if (index === 3) {
                    res.status(200);
                    res.json({
                        status: 200,
                        data: data
                    });
                }
            });
        })(idx);
    }
    connection.end(function (err) {
    });
});

router.post('/getData/:id', function (req, res) {
    var id = req.params.id;
    var type = req.body.type || '';
    var count = req.body.count || '';
    var acceptedTypes = ['day', 'hour'];
    var accepted = false;

    //Check for empty body
    if (type === '' || count === '') {
        res.status(401);
        res.json({
            'status': 401,
            'message': 'POST body contains at least one empty field'
        });
        return;
    }

    //Check type body with accepted types
    for (var i = 0; i < acceptedTypes.length; i++) {
        if (type.match(acceptedTypes[i])) {
            accepted = true;
        }
    }
    //Respond if unaccepted
    if (!accepted) {
        res.status(403);
        res.json({
            'status': 403,
            'message': 'POST body contains forbidden type',
            'allowed types': acceptedTypes
        });
        return;
    }

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'api',
        password: 'Kappa1234!',
        database: 'meterkast',
        timezone: '+00:00'
    });

    connection.connect(function (err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
            return;
        }
    });

    //Fetch data for userid entered in param
    var query = '';
    switch (type) {
        case 'hour':
            query = "SELECT waarde,DATE_FORMAT(tijdstip, '%Y-%m-%d %H:%i') as tijdstip FROM meetwaarden WHERE tijdstip >= date_sub(now(),interval ? hour) AND gebruikersid = ?";
            break;
        case 'day':
            query = "SELECT waarde,DATE_FORMAT(tijdstip, '%Y-%m-%d %H:%i') as tijdstip FROM meetwaarden WHERE tijdstip >= date_sub(now(),interval ? day) AND gebruikersid = ?";
            break;
    }
    connection.query(query, [count, id], function (err, results, fields) {
        if (err) {
            console.log(err);
            return;
        }

        if (results.length > 0) {
            //respond if result is available
            res.status(200);
            res.json({
                'status': 200,
                'data': { 'userId': id, 'results': results }
            });
        } else {
            res.status(404);
            res.json({
                'status': 404,
                'message': 'No results found'
            });
        }
    });
    connection.end(function (err) {
    });
});

router.get('/addPulse', function (req, res) {
    res.status(200);
    var username = req.app.get('userid');

    for (var idx = 0; idx < pulsen.length; idx++) {
        if (pulsen[idx].gebruikersnaam === username) {
            pulsen[idx].pulsen += 1;
            res.json({
                'status': 200,
                'message': 'Pulse succesvol toegevoegd!'
            });
        }
    }
});

router.get('/', function (req, res) {
    res.status(200);
    res.json({
        'description': 'Meterkast API version 1'
    });
});

module.exports = router;
