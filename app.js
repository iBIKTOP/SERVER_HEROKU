const express = require("express");
const app = express();
const mysql = require("mysql");
const fs = require("fs");
// const IP = require("./tools/getIP.js");
// const serverIP = IP.getIP();
const md5 = require("md5");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

let connection = null;
if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
    connection = mysql.createConnection({
        host: 'q7cxv1zwcdlw7699.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
        user: 'qo4wtshoowl0t1lu',
        password: 'epaso6xnhmawlvfg',
        database: 'tggbgd35s83tdavi'
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


app.get("/irregular_verbs", function (req, res) {
    console.log("start!!!!");
    let query = "SELECT * FROM irregular_verbs";
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.json(data);
    });
});

//getting user's groups
app.get("/:userID", function (req, res) {
    let userID = req.params.userID;
    console.log("запрос с : " + userID);
    let query = `SELECT * FROM user_groups WHERE user_id='${userID}'`;
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.json(data);
    });
});

app.get("/users/:login", function (req, res) {
    let login = req.params.login;
    let query = `SELECT * FROM users WHERE login='${login}'`;
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.json(data);
    });
});

app.post("/addUser", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    let query = "INSERT INTO `users` (`id`, `login`, `pass`) VALUES (NULL,'" + req.body.login + "','" + md5(req.body.pass) + "')";
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        res.json(req.body);
    });
});

app.listen(PORT, function () {
    // console.log("Server is available at http://" + serverIP + ":" + PORT);
    console.log("Server is started in port: " + PORT);
});