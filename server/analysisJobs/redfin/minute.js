const request =  require('request');
const cheerio =  require('cheerio');
const mongoose = require('mongoose');
const keys = require('../../config/keys');
const interestedListing = null;


async function minute(){
    
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

        //fetch one from the database that has check==false and DOM > 60 days
        await Listing.findOne({check: false}, async function (err, listing) {
            try{
                if(listing[0].dom > 60){
                    interestedListing = listing[0];
                }
            }catch(error){
                console.log(err);
            }
        });

        //scrape the link of the one found above to calculate ARV
        if (interestedListing !== null){
            await axios.get(interestedListing.link).then((res) => {

                const $ = cheerio.load(res.data);
                const listings = $('.SimilarSoldSection .SimilarCardReact a').each((i, el) => {
                    const address = $(el).text();
                    const link = $(el).attr('href');
                    console.log(address, link);
                });

            }).then()
        }

        //if ARV is a decent price then text


        
    } catch (err){
        conaole.log(err);
    }

};

minute();