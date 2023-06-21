require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
const User = require("./model/user");
const Movie = require("./model/movie");

let TOKEN_KEY = "gfg_jwt_secret_key";

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    //res.send('hello world')
    console.log("hello world");
    res.header('Content-type', 'text/html');
    return res.end('<h1>Hello, Secure World!</h1>');
  });



app.post("/movie", async (req, res) => {
    
    console.log(req);

    try {
 
        const {
            movieId,
            movieName,
            yearReleased
        } = req.query;

        if (!(movieId&&movieName&&yearReleased)){
            res.status(400).send("All Inputs required...");
        } 

        const existingMovie = await Movie.findOne({movieId:movieId});
        if (existingMovie){
            res.status(400).send("MovieId already exists");
        }

        const movie = await Movie.create({
            movieId:movieId,
            movieName:movieName,
            yearReleased:yearReleased
        });

        res.status(200).send("Movie Added");
    } catch(error){
        console.log(error);

    }

});

//app.route("/movie").get(function(req,res) {
app.get("/movie", (req,res)=>{
    console.log("In movie get call");
    Movie.find().then( function(err,response) {
        if(err){
            res.send(err);
            console.log(err);
        } else {
            res.send(response);
        }
    })
});

app.post("/user", async (req, res) => {
    console.log(req);
    try {
 
        const {
            email,
            userName,
            password,
            watchList
        } = req.query;

        if (!(email&&userName&&password&&watchList)){
            res.status(400).send("All Inputs required...");
        } 

        const existingUser = await User.findOne({email:email});
        if (existingUser){
            res.status(400).send("email already exists");
        }

        const user = await User.create({
            email:email,
            userName:userName,
            password:password,
            watchlist:watchList
        });

        let data = {
            time:Date(),
            userId:12,
        }

        const token = jwt.sign(data,TOKEN_KEY);
        user.token=token;
        res.status(201).send(token);

    } catch(error){
        console.log(error);

    }

});

app.route("/users").get(function(req,res) {
    User.find().then(function(err,result) {
        if(err){
            res.send(err);
            console.log(err);
        } else {
            res.send(result);
        }
    })
});


module.exports=app