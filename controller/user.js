const User = require("../models/user");

module.exports.signupform = (req,res)=>{
    res.render("user/signup.ejs");
}
 module.exports.loginform = (req,res)=>{
    res.render("user/login.ejs");
}
module.exports.afterlogin = async(req,res)=>{
    req.flash("success","Logged in successfully");
    let redirecturl = res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);
    
}
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");

    })
}

module.exports.signup = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newuser = new User({username,email});
        const registereduser = await User.register(newuser,password);
        console.log(registereduser);
        req.login(registereduser, function(err) {
            if (err) { return next(err); }
            req.flash("success","Successfully created a new user");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

