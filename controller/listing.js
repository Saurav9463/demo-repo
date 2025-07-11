const Listing = require("../models/listing");

module.exports.index = async (req,res,next)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    
}
module.exports.rendernewform = (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "Please log in to create a new listing")
        return res.redirect("/login")
    }
    res.render("listings/new.ejs");
}
module.exports.showlisting = async (req,res, next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"review",
        populate: {
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}
module.exports.createlisting = async (req, res, next) => {
    console.log("File data:", req.file);  // Log the entire file object
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // if (req.file) {
    //     newListing.image = {
    //         url: req.file.path,
    //         filename: req.file.filename
    //     };
    // }
    newListing.image = {url,filename};
    await newListing.save();
    console.log("Saved listing image:", newListing.image);  // Log the saved image data
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}
module.exports.rendereditform = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
   
    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/w_250,e_blur:150");
    res.render("listings/edit.ejs", { listing, OriginalImageUrl });
}
module.exports.updatelisting = async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(
    //         400,"send valide data for listing"
    //     )
    // }
    const {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
        
    req.flash("success","Successfully updated a listing");
    res.redirect(`/listings/${id}`);
}
module.exports.destroylisting = async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted a listing");
    res.redirect("/listings");
}