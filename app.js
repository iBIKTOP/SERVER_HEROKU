const express = require("express");
const app = express();
const mysql = require("mysql");
const fs = require("fs");
const IP = require("./tools/getIP.js");
const serverIP = IP.getIP();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

let connection = null;
if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'db'
    });
}

const PORT = process.env.PORT || 5000;


app.use(function (request, response, next) {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", function () { });

    setInterval(function () {
        connection.query('SELECT 1');
    }, 5000);

    next();
});


app.get("/", function (req, res) {
    let query = "SELECT * FROM words";
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.json(data);
    });
});

app.get("/users", function (req, res) {
    let query = "SELECT * FROM users";
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.json(data);
    });
});

app.post("/addUser", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    console.log(res.body);
    let query = "INSERT INTO `users` (`id`, `login`, `pass`) VALUES (NULL, res.body.login, res.body.pass);";
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.json(data);
    });
});

app.listen(PORT, function () {
    console.log("Server is available at http://" + serverIP + ":" + PORT);
});