const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

// создаем парсер для данных application/x-www-form-urlencoded
// const urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
// //---------------блок посвященный Роутеру-------------------//
// // определяем Router
// const productRouter = express.Router();
// // сопотавляем роутер с конечной точкой "/products"
// app.use("/products", productRouter);
// // определяем маршруты и их обработчики внутри роутера
// productRouter.use("/create", function (request, response) {
//     response.send("Добавление товара");
// });
// productRouter.use("/:id", function (request, response) {
//     response.send(`Товар ${request.params.id}`);
// });
// productRouter.use("/", function (request, response) {
//     response.send("Список товаров");
// });
// //---------------------------------------------------------//

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

// app.get("/register", urlencodedParser, function (request, response) {
//     response.sendFile(__dirname + "/public/register.html");
// });

// app.post("/register", urlencodedParser, function (request, response) {
//     if (!request.body) return response.sendStatus(400);
//     console.log(request.body);
//     response.send(`${request.body.userName} - ${request.body.userAge}`);
// });












app.get("/", function (request, response) {
    response.send("Hello in EnglishClub");
});
// app.use("/home", function (request, response) {
//     response.status(404).send(`Ресурс не найден`);
// });
app.get("/words", function (req, res) {
    let data = fs.readFileSync("words.json", "utf8");
    let words = JSON.parse(data);
    res.send(words);
})
app.get("/words/:id", function (req, res) {
    let id = req.params.id; // получаем id
    let data = fs.readFileSync("words.json", "utf8");
    let words = JSON.parse(data);
    let word = null;
    // находим в массиве по id
    for (let i = 0; i < words.length; i++) {
        if (words[i].id == id) {
            word = words[i];
            break;
        }
    }
    // отправляем данные
    if (word) {
        res.send(word);
    }
    else {
        res.status(404).send("Данные с таким ID не найдено!");
    }
});

// получение отправленных данных
app.post("/add", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    let id = new Date.now();
    let eng = req.body.eng;
    let rus = req.body.rus;
    let word = { id: id, eng: eng, rus: rus };

    let data = fs.readFileSync("words.json", "utf8");
    let words = JSON.parse(data);

    // добавляем пользователя в массив
    words.push(word);
    data = JSON.stringify(words);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("words.json", data);
    res.send(word);
});

// удаление данных по id
app.delete("/words/:id", function (req, res) {

    let id = req.params.id;
    let data = fs.readFileSync("words.json", "utf8");
    let words = JSON.parse(data);
    let index = -1;
    // находим индекс в массиве
    for (let i = 0; i < words.length; i++) {
        if (words[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        let word = words.splice(index, 1);
        console.log(words);
        let data = JSON.stringify(words);
        fs.writeFileSync("words.json", data);
        // отправляем удаленного пользователя
        res.send("Delete " + word);
    }
    else {
        res.status(404).send("Данные с таким ID не найдено!");
    }
});

// изменение данных
app.put("/words", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    let id = req.body.id;
    let eng = req.body.eng;
    let rus = req.body.rus;

    let data = fs.readFileSync("words.json", "utf8");
    let words = JSON.parse(data);
    let word;
    for (let i = 0; i < words.length; i++) {
        if (words[i].id == id) {
            word = words[i];
            break;
        }
    }
    // изменяем данные
    if (word) {
        word.eng = eng;
        word.rus = rus;
        let data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(word);
    }
    else {
        res.status(404).send(word);
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log("start on port 3000");
});