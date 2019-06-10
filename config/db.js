if(process.env.NODE_ENV=="prod"){
    module.exports={mongoURI:"mongodb://kshitiz:kshitiz0@ds227565.mlab.com:27565/youjot-prod"}
}else{
    module.exports={mongoURI:"mongodb://localhost/youjot-dev"}
}