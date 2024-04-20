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
const Option = mongoose.model("Option");

const app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const authFreePaths = ['/login', '/sign-up'];

app.use((req, res, next) => {
    if (!authFreePaths.includes(req.path)) {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

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
const registrationMessages = { "USERNAME ALREADY EXISTS": "Username already exists", "PASSWORD TOO SHORT": "Password should more then 8 characters" };

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
        await auth.startAuthenticatedSession(req, user);
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
        const newUser = await auth.register(
            sanitize(req.body.name),
            req.body.password
        );
        await auth.startAuthenticatedSession(req, newUser);
        res.redirect('/topics');
    } catch (err) {
        console.log(err);
        res.render('sign-up', { message: registrationMessages[err.message] ?? 'Registration error' });
    }
});

app.get("/topics", async (req, res) => {
    const topics = await Topic.find({});
    res.render("topics", { topics: topics, user: req.session.user });
});

app.post("/topics", async (req, res) => {
    const newTopic = new Topic({ topic: req.body.topic, createdAt: getDate() });
    await newTopic.save();
    res.redirect("/topics");
});

app.get('/topics/:slug', async (req, res) => {
    const topic = await Topic.findOne({ slug: req.params.slug });
    res.render('topics-detail', { topic });
});

app.post('/topics/:slug', async (req, res) => {
    const newOption = new Option({answer: req.body.option});
    const topic = await Topic.findOne({ slug: req.params.slug });
    topic.options.push(newOption);
    await topic.save();
    res.redirect("/topics/" + req.params.slug);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT);
    console.log("The server is running");
    console.log("Press control+c to stop");
});
