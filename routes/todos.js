const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Todo } = require('../models/Todo');
const {ensureAuthenticated}= require('../helpers/auth');

router.get("/add",ensureAuthenticated, (req, res) => {
    res.render("todos/add");
})
router.get("/", ensureAuthenticated,(req, res) => {

    Todo.find({user:req.user.id}).then(todos => {
        console.log("Todos", todos);
        res.render("todos/todosIndex", { todos: todos });
    })

})


router.post("/", ensureAuthenticated,(req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "Please add some title" });
    }

    if (errors.length > 0) {
        res.render('todos/add', {
            errors: errors,
            title: req.body.title,
        })

    } else {
        const newTodo = {
            title: req.body.title,
            user:req.user.id

        }
        new Todo(newTodo)
            .save()
            .then(todo => {
                req.flash('success_msg', 'Todo added successfully');
                res.redirect("/todos");
            })
    }

});

router.get("/edit/:id", ensureAuthenticated,(req, res) => {
    Todo.findOne({ _id: req.params.id })
        .then(todo => {
            if(todo.user!=req.user.id){
                req.flash("error_msg","Not Authorized");
                res.render("/todos");
            }else{
                res.render("todos/edit", { todo: todo });
            }
           
        })

})

router.put("/:id",ensureAuthenticated, (req, res) => {
    Todo.findOne(
        { _id: req.params.id }
    ).then((todo) => {
        todo.title = req.body.title;
        todo.save().then(idea => {
            req.flash('success_msg', 'Todo updated successfully');
            res.redirect("/todos");
        })
    })

})

router.put("/editStatus/:id", ensureAuthenticated,(req, res) => {
    debugger;
    Todo.findOne(
        { _id: req.params.id }
    ).then((todo) => {
        if (todo.status == "Not Done")
            todo.status = "Done";
        else if (todo.status == "Done")
            todo.status = "Not Done"


        todo.save().then(todo => {
            res.redirect("/todos");
        })
    })

})

router.delete("/:id",ensureAuthenticated, (req, res) => {
    Todo.remove({
        _id: req.params.id
    }).then((todo) => {
        req.flash("success_msg", "Todo deleted successfully");
        res.redirect("/todos");
    })
})

module.exports = router;