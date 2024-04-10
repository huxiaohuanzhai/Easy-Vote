import './config.mjs';
import './db.mjs'; import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';

const app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    console.log(req.body);
    res.redirect("/main");
});

app.get("/main", (req, res) => {
    res.render("studentMain")
});


app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT);
    console.log("The server is running");
    console.log("Press control+c to stop");
});
