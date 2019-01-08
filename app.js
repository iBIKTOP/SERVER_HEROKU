const express = require("express");
const fs = require("fs");

const app = express();
app.use("/static", express.static(__dirname + "/public")); //Теперь чтобы обратиться к файлу about.html, необходимо отправить запрос http://localhost:3000/static/about.html.
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

app.get("/", function (request, response) {
    response.send("Hello");
});
app.use("/home", function (request, response) {
    response.status(404).send(`Ресурс не найден`);
});
app.listen(process.env.PORT || 3000, function () {
    console.log("start on port 3000");
});