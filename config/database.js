const mongoose = require("mongoose");

const {MONGO_URI}=process.env;

exports.connect = () => {
    mongoose.connect("mongodb://localhost:27017/moviedb",{

    }).then(()=> {
        console.log("succesfully connected to moviedb");
    }).catch((error)=> {
        console.log("Database connection failed ..... exiting");
        console.log("error");
        process.exit(1);
    })
};