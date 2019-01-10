const express = require("express");
const app = express();
const mysql = require("mysql");
const fs = require("fs");

let connection = null;
if(process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else{
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'db'
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
    next();
});

app.get("/", function(req,res){
    connection.connect();
    let query = "SELECT * FROM words";
    connection.query(query, function (error, data, fields) {
        if (error) throw error;
        console.log(data);
        res.send(data);
    });
    connection.end();
});

app.listen(PORT, function(){
    console.log("Server started in port " + PORT);
})


