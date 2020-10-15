const cheerio =  require('cheerio');
const mongoose = require('mongoose');
const axios =  require('axios');
const TwilioTexting = require('../../services/TwilioTexting');
const foundListing = require('../../services/textTemplates/foundListing');
const keys = require('../../config/keys');
require('../../models/listing.js');
let interestedListing = null;
let all_Deals = []

const Listing = mongoose.model('listing');

async function minute(){
    
    await mongoose.connect(keys.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("DB Connected!"); 
        console.log("Scraping Links!"); 
        console.log("Analyzing Data ...");
    })
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
        process.exit(0); 
    });

    try{

        //fetch one from the database that has check==false and DOM > 60 days
        await Listing.find({checked: false}, function (err, listing) {
            try{
                console.log("listing",listing[0]);
                // if(listing[0].dom > 60){
                    interestedListing = listing[0];
                // }
            }catch(error){
                console.log(err);
            }
        })

        .then(async function(){

            // scrape the link of the one found above to calculate ARV
            if (interestedListing !== null){
                console.log("About to scrape listing");
                await axios.get(interestedListing.link).then((res) => {

                    const $ = cheerio.load(res.data);
                    const listings = $('.SimilarSoldSection a').each((i, el) => {
                        const address = $(el).text();
                        const link = $(el).attr('href');
                        console.log(address, link);
                    });

                }).then(async function(){

                    //CALCULATE ARV
                    
                    //if ARV is a decent price then update db and close
                    await Listing.findOneAndUpdate({address: interestedListing.address}, 
                        { 
                            deal: true
                        }
                    ).then(async function(){
                        await mongoose.connection.close(function(){
                            console.log("Analysis Done.\n DB Updated.");
                            console.log("DB Disconnected.");
                            process.exit(0); 
                        })
                    })

                })
            
            // if no listing was found then compile all the trues 
            }else{

                await Listing.find({deal: true}, function (err, listing) {
                    try{
                        if (listing[0] !== null || listing[0] !== undefined){
                            all_Deals.push(listing[0]);
                        }
                    }catch(error){
                        console.log(err);
                    }
                })

                // send text if deals were found
                .then(async function(){
                
                    if (all_Deals !== null || all_Deals !== undefined){
                    
                        await TwilioTexting(foundListing("kai", interestedListing), keys.SUBSCRIBER_NUMBER)
                    
                        .then(async function(){
                            await mongoose.connection.close(function(){
                                console.log("Analysis Done.\n DB Updated.");
                                console.log("DB Disconnected.");
                                process.exit(0); 
                            })
                        });
                    
                    }else{

                        await mongoose.connection.close(function(){
                            console.log("Analysis Done.\n DB Updated.");
                            console.log("DB Disconnected.");
                            process.exit(0); 
                        })
                    }
                    
                })

            }
        })

    } catch (err){
        console.log(err);
    }

};

minute();