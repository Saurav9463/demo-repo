const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js")
const ExpressError = require("../utils/expresserror.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const { isloggedin,author } = require("../middleware.js");
const reviewcontroller = require("../controller/review.js");

const validateReview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }

};

router.post("/",validateReview,isloggedin ,wrapasync(reviewcontroller.createreview))
router.delete("/:reviewId",isloggedin,author,wrapasync(reviewcontroller.destoryreview))
module.exports = router;