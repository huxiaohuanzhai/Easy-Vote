import "./config.mjs";
import "./db.mjs";
import cors from "cors";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import { fileURLToPath } from "url";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize";
import * as auth from "./auth.mjs";
import { error } from "console";

const User = mongoose.model("User");
const Topic = mongoose.model("Topic");
const Option = mongoose.model("Option");

const app = express();
app.set("view engine", "hbs");
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ name: sanitize(username) });
      if (!user) {
        return done(null, false, { message: "User does not exist" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Password does not match" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let user = await User.findById(id);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

const authFreePaths = ["/login", "/sign-up"];

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// app.use((req, res, next) => {
//   if (!authFreePaths.includes(req.path)) {
//     if (!req.session.user) {
//       res.redirect("/login");
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

function getDate() {
  let temp = new Date();
  let year = temp.getFullYear();
  let month = temp.getMonth();
  let day = temp.getDate();
  let hour = temp.getHours();
  let minute = temp.getMinutes();
  return month + "/" + day + "/" + year + " " + hour + ":" + minute;
}

const loginMessages = {
  "PASSWORDS DO NOT MATCH": "Incorrect password",
  "USER NOT FOUND": "User doesn't exist",
};
const registrationMessages = {
  "USERNAME ALREADY EXISTS": "Username already exists",
  "PASSWORD TOO SHORT": "Password should more then 8 characters",
};

app.get("/", (req, res) => {
  res.json({ msg: "HI!" });
});

app.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    user = await User.findOne({ name: req.body.name });
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ message: "User cannot found" });
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.json({ message: "Password does not match" });
      }
      await auth.startAuthenticatedSession(req, user);
      return res.json({ message: "Succeed", user: user });
    });
  })(req, res, next);
});

app.get("/home", (req, res) => {
  res.json({ message: "succeed" });
});

app.post("/test", async (req, res) => {
  res.json("fail");
});

app.post("/sign-up", async (req, res) => {
  try {
    const newUser = await auth.register(
      sanitize(req.body.name),
      req.body.password
    );
    await auth.startAuthenticatedSession(req, newUser);
    res.json({ message: "Succeed", user: newUser });
  } catch (err) {
    console.log(err);
    res.json({
      message: registrationMessages[err.message] ?? "Registration error",
    });
  }
});

app.get("/topics", async (req, res) => {
  const topics = await Topic.find({}).populate("owner");
  res.json(topics);
});

app.post("/topics", async (req, res) => {
  const newTopic = new Topic({
    topic: req.body.topic,
    createdAt: getDate(),
    owner: req.body.user._id,
  });
  await newTopic.save();
  res.json({ message: "Succeed" });
});

app.get("/topics/:slug", async (req, res) => {
  const topic = await Topic.findOne({ slug: req.params.slug });
  res.json({ topic: topic });
});

app.post("/topics/:slug", async (req, res) => {
  let find = false;
  let target;
  const topic = await Topic.findOne({ slug: req.params.slug });
  for (let i = 0; i < topic.options.length; i++) {
    if (topic.options[i].answer === req.body.option) {
      target = topic.options[i];
      find = true;
      break;
    }
  }
  if (!find) {
    let voter = [req.body.user._id];
    const newOption = new Option({ answer: req.body.option, voter: voter });
    topic.options.push(newOption);
    await topic.save();
  } else {
    target.voter.push(req.body.user._id);
    await topic.save();
  }
  res.json({ message: "Succeed" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(process.env.PORT);
  console.log("The server is running");
  console.log("Press control+c to stop");
});

// app.get('/', (req, res) => {
//     res.redirect("/login");
// });

// app.get("/login", (req, res) => {
//     res.render("login");
// });

// app.post("/login", async (req, res) => {
//     try {
//         const user = await auth.login(
//             sanitize(req.body.name),
//             req.body.password
//         );
//         await auth.startAuthenticatedSession(req, user);
//         res.redirect('/topics');
//     } catch (err) {
//         console.log(err)
//         res.render('login', { message: loginMessages[err.message] ?? 'Login unsuccessful' });
//     }
// });

// app.get("/sign-up", (req, res) => {
//     res.render("sign-up");
// });

// app.post("/sign-up", async (req, res) => {
//     try {
//         const newUser = await auth.register(
//             sanitize(req.body.name),
//             req.body.password
//         );
//         await auth.startAuthenticatedSession(req, newUser);
//         res.redirect('/topics');
//     } catch (err) {
//         console.log(err);
//         res.render('sign-up', { message: registrationMessages[err.message] ?? 'Registration error' });
//     }
// });
