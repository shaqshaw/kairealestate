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
            await request(`https://www.redfin.com/city/16657/TX/San-Antonio/filter/property-type=house,max-price=600k,remarks=fixer+upper,include=forsale+mlsfsbo+construction+fsbo+sold-1yr,viewport=29.48102:29.38369:-98.3798:-98.50683`, async function(error, response, html){

                if(!error && response.statusCode ===200){
                    const $ = cheerio.load(html);
                    const listings = $('.HomeCardContainer a').each((i, el) => {
                        const address = $(el).text();
                        const link = $(el).attr('href');
                        console.log(address, link);
                    });
                }
            });
        }

        //if ARV is a decent price then text


        
    } catch (err){
        conaole.log(err);
    }

};

minute();