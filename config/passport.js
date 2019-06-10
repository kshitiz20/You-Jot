const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const passport= require('passport');

const strategy = (passport) => {

    passport.use(new LocalStrategy({ usernameField: 'email' },
        (email, password, done) => {
            User.findOne({
                email: email
            }).then(user => {
                if (!user)
                    return done(null, false, { message: 'No User Found' });

                //Match User

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        done(null, user);
                    } else {
                        done(null, false, { message: "Incorrect Password! Please try again" });
                    }
                })

            })
        }
    ))
}

const serialize=passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

const deserialize= passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  })



module.exports = { strategy,
   serialize,
   deserialize
      
}