import './config.mjs';
import './db.mjs'; import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';
import sanitize from 'mongo-sanitize';
import * as auth from './auth.mjs';

const User = mongoose.model("User");
const Topic = mongoose.model("Topic");

const app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

function getDate() {
    let temp = new Date();
    let year = temp.getFullYear();
    let month = temp.getMonth();
    let day = temp.getDate();
    let hour = temp.getHours();
    let minute = temp.getMinutes();
    return month + "/" + day + "/" + year + " " + hour + ":" + minute;
}

const loginMessages = { "PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist' };
const registrationMessages = { "USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short" };

app.get('/', (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const user = await auth.login(
            sanitize(req.body.name),
            req.body.password
        );
        res.redirect('/topics');
    } catch (err) {
        console.log(err)
        res.render('login', { message: loginMessages[err.message] ?? 'Login unsuccessful' });
    }
});

app.get("/sign-up", (req, res) => {
    res.render("sign-up");
});

app.post("/sign-up", async (req, res) => {
    try {
        console.log(req.body);
        const newUser = await auth.register(
            sanitize(req.body.name),
            req.body.password
        );
        console.log(newUser);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.render('sign-up', { message: registrationMessages[err.message] ?? 'Registration error' });
    }
});

app.get("/topics", async (req, res) => {
    const topics = await Topic.find({});
    res.render("topics", { topics: topics });
});

app.post("/topics", async (req, res) => {
    const newTopic = new Topic({ topic: req.body.topic, createdAt: getDate() });
    await newTopic.save();
    console.log(newTopic);
    res.redirect("/topics");
});


app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT);
    console.log("The server is running");
    console.log("Press control+c to stop");
});
