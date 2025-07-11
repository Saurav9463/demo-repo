const Listing = require("./models/listing")
const Review = require("./models/review")

module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in to create a new listing")
        return res.redirect("/login")
    }
    next();
};
module.exports.RedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.owner = async (req,res,next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error", "This option can only be accessed by the owner");
        return res.redirect(`/listings/${id}`);

    }
    next();

}
module.exports.author = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error", "You are not the author of this Review");
        return res.redirect(`/listings/${id}`);

    }
    next();

}