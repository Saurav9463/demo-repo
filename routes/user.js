const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const {RedirectUrl} = require("../middleware.js");
const usercontroller = require("../controller/user.js");
const user = require("../models/user.js");

router.route("/signup")
.get(usercontroller.signupform)
.post(wrapAsync(usercontroller.signup)); 

router.route("/login")
.get(usercontroller.loginform)
.post(RedirectUrl,passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login",

}),
 usercontroller.afterlogin);

router.get("/logout",usercontroller.logout)

module.exports = router;
