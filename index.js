if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Url = process.env.ATLASDB_URL;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/expresserror.js")
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const user = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main()
.then(()=>{
    console.log("conected to db")
})
.catch((err)=>{
        console.log(err)
});

async function main(){

    await mongoose.connect(Url);
}
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:Url,
    touchAfter:24*60*60,
    crypto:{
        secret:process.env.SECRET
    }
})
store.on("error",function(e){
    console.log("session error",e);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + (1000 * 60 * 60 * 24 * 30),
        maxAge:1000 * 60 * 60 * 24 * 30
    }
    
}


// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser= req.user;
    next();
})
app.get("/demouser",async (req,res)=>{
    let fakeuser = new User({
        username:"demouser",
        email:"demouser@gmail.com"
    })
    let newuser = await User.register(fakeuser,"password");
    res.send(newuser);
})
app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)
app.use("/",user)

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})