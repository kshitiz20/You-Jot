const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');
const {Idea} = require('../models/Idea');
const {ensureAuthenticated}= require('../helpers/auth');

router.get("/add", ensureAuthenticated, (req,res)=>{
    res.render("ideas/add");
})

router.get("/edit/:id",ensureAuthenticated ,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then((idea)=>{
        if(idea.user!=req.user.id){
            req.flash("error_msg","Not Authorized");
            res.render("/ideas");
        }else{
            res.render("ideas/edit",{idea:idea});
        }
       
    })
    
})


router.get("/",ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        console.log(ideas);
        res.render("ideas/ideasIndex",{ideas:ideas})
    })
   
})

router.post("/",ensureAuthenticated,(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({text:"Please add some title"});
    }
    if(!req.body.details){
        errors.push({text:'Please add details'});
    }

    if(errors.length>0){
        res.render('ideas/add', {
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
        
    }else{
        const newUser= {
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea=>{
            req.flash('success_msg','Idea added successfully');
            res.redirect("/ideas");
        })
    }
    
});

router.put("/:id",ensureAuthenticated,(req, res)=>{
    Idea.findOne(
        {_id:req.params.id}
    ).then((idea)=>{
       idea.title=req.body.title;
       idea.details=req.body.details;

       idea.save().then(idea=>{

        req.flash('success_msg','Idea updated successfully');
           res.redirect("/ideas");
       })
    })
   
})

router.delete("/:id",ensureAuthenticated,(req, res)=>{
    console.log(req.params)
    Idea.findOne(
        {_id:req.params.id}
    ).then((idea)=>{
    //    idea.title=req.body.title;
    //    idea.details=req.body.details;
        console.log("idea->>>>>>    "+idea)
       Idea.deleteOne({_id:idea.id}).then(idea=>{
           req.flash('success_msg','Idea deleted successfully');
           res.redirect("/ideas");
       })
    })
  
   
})

module.exports=router;
