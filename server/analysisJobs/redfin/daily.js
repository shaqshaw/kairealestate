const request =  require('request');
const cheerio =  require('cheerio');

const zip='29115';
let formatList = 'hello';


async function zillow(){
    let all_listings = [];


    await request(`https://www.zillow.com/homes/${zip}_rb/`, async function(error, response, html){

        if(!error && response.statusCode ===200){
            const $ = cheerio.load(html);
            const listings = $('.list-card-info a').each((i, el) => {
                const address = $(el).text();
                const link = $(el).attr('href');
                
                let foundListing = {
                    address: address,
                    link: link
                }
                console.log(foundListing);
                all_listings.pop(foundListing);
            });

        }

    });

}


module.exports={
    zillow
}
