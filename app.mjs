import './config.mjs';
import './db.mjs'; import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';
import sanitize from 'mongo-sanitize';
import * as auth from './auth.mjs';

const User = mongoose.model("User");

const app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

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
        res.redirect('/main');
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

app.get("/main", (req, res) => {
    res.render("studentMain")
});


app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT);
    console.log("The server is running");
    console.log("Press control+c to stop");
});
