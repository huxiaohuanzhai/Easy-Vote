import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

export const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user;
        fulfill(user);
      } else {
        reject(error);
      }
    });
  });
};

export const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};

export const register = (name, password) => {
  return new Promise(async (fulfill, reject) => {
    if (password.length < 8) {
      reject({ message: 'PASSWORD TOO SHORT' });
    }
    else {
      let account = await User.find({ name: name });
      if (account.length !== 0) {
        reject({ message: 'USERNAME ALREADY EXISTS' });
      }
      else {
        let salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
        const newAccount = new User({ name, password });
        await newAccount.save();
        fulfill(newAccount);
      }
    }
  });
}

export const login = (name, password) => {
  return new Promise(async (fulfill, reject) => {
    const user = await User.find({ name: name });
    if (user.length === 0) {
      reject({ message: "USER NOT FOUND" });
    }
    else {
      if (bcrypt.compareSync(password, user[0].password)) {
        fulfill(user[0]);
      }
      else {
        reject({ message: "PASSWORDS DO NOT MATCH" });
      }
    }
  });
};