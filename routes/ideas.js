const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');
const {Idea} = require('../models/Idea');


router.get("/add", (req,res)=>{
    res.render("ideas/add");
})

router.get("/edit/:id", (req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then((idea)=>{
        res.render("ideas/edit",{idea:idea});
    })
    
})


router.get("/",(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        console.log(ideas);
        res.render("ideas/ideasIndex",{ideas:ideas})
    })
   
})

router.post("/",(req,res)=>{
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
            details:req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea=>{
            req.flash('success_msg','Idea added successfully');
            res.redirect("/ideas");
        })
    }
    
});

router.put("/:id",(req, res)=>{
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

router.delete("/:id",(req, res)=>{
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
