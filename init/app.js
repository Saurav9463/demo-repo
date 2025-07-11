
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/listingsindia";

main()
.then(()=>{
    console.log("conected to db")
})
.catch((err)=>{         
    console.log(err)
});

async function main(){

    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6852d4dbaf7334c1b4f0b1a9"

    }))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();
