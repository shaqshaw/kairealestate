const cheerio =  require('cheerio');
const mongoose = require('mongoose');
const axios =  require('axios');
const keys = require('../../config/keys');
require('../../models/listing.js');
let listing_links = [];

const Listing = mongoose.model('listing');

async function daily(){
    
    //connect db
    await mongoose.connect(keys.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("DB Connected!"); 
        console.log("Fetching All Data Listing from Redfin!"); 
        console.log("Analyzing Data ...");
    })
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
        process.exit(0); 
    });

    try{

        //fetch all listings meeting criteria and in san antonio
        await axios.get(keys.GOLDEN_FILTER)
        
        .then(async function(res){

            //parse data to get listings
            const $ = cheerio.load(res.data);
            const listings = $('.HomeCardContainer a').each((i, el) => {
                const address = $(el).text();
                const link = $(el).attr('href');

                if( address!== '' && address!=="Local rules require you to be signed in to see more photos." && address !== " Sign in for price "){
                    address="NOT AVAILABLE";
                }

                listing_links.push({
                    address,
                    link: `https://www.redfin.com` + link
                })

            });

            //store listings in db
            const randomVar = await Promise.all(
                listing_links.map( async function (listing){
                    await new Listing({
                        address: listing.address,
                        link: listing.link
                    }).save()
                })
            )

            //disconnect db
            .then( async function(){
                await mongoose.connection.close(function(){
                    console.log("Analysis Done.\n DB Updated.");
                    console.log("DB Disconnected.");
                    process.exit(0); 
                })
            })
        })

    } catch (err){
        console.log(err);
    }

};

daily();