const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
const {User} = require('../models/User');
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.get("/register", (req, res) => {
    res.render("users/register");
})

//Register User Post
router.post("/register", (req, res) => {
    let errors = [];

    if (req.body.password1.length < 4) {
        errors.push({ text: "Password should have atleast 4 characters" });
    }
    if (req.body.password1 != req.body.password2) {
        errors.push({ text: "Passwords do not match" });
    }

    console.log(errors);
    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2
        })
    } else {
        
        User.findOne({email: req.body.email })
            .then(user => {
                console.log("User->" +user);
                if (user) {
                    req.flash("error_msg", "Email already exists");
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password1,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            console.log(newUser);
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registered successfully. Go ahead and Login :)');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    throw err;
                                    return;
                                });
                        });
                    });
                }
            })
    }
  

})

module.exports = router;