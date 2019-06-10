const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const TodoSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now()
    },
    status:{
        type:String,
        default:"Not Done"
    }
});

const Todo= mongoose.model("todo", TodoSchema);

module.exports={Todo};