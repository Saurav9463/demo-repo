const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createreview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","Successfully created a review");
    res.redirect(`/listings/${listing._id}`);
    // res.send("new review is created")
}
module.exports.destoryreview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted a review");
    res.redirect(`/listings/${id}`);
}