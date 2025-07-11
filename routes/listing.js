const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js")
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expresserror.js")
const {isloggedin,owner} = require("../middleware.js");
const listingcontroller = require("../controller/listing.js")
const multer = require("multer");
const {storage} = require("../cloudinary.js")
const upload = multer({storage});
const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

router.route("/")
.get(wrapasync(listingcontroller.index))
.post(isloggedin, upload.single('listing[image]'), wrapasync(listingcontroller.createlisting));

router.get("/new",isloggedin,listingcontroller.rendernewform);

router.route("/:id")
.get(wrapasync(listingcontroller.showlisting))
.put(isloggedin, owner,upload.single('listing[image]'),wrapasync(listingcontroller.updatelisting))
.delete(isloggedin, owner,wrapasync(listingcontroller.destroylisting));

router.get("/:id/edit",isloggedin,owner, wrapasync(listingcontroller.rendereditform));

module.exports = router;