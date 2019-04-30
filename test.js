const fs = require('fs');
const expect = require('chai').expect;
const dom = require('cheerio');

const logo = "/resources/erhvervsstyrelsen_logo.png";

describe('#ID: OK-7 - Ændre logo på skaleringsportal', function () {
    it('Log file must reside in resources', function () {
        // Check if logo resides in public/resources/
        if (!fs.existsSync(__dirname + '/public' + logo)){
            throw new Error("The logo file does not exist in the resources folder");
        }

    });

    it('Logo path must be referenced inside public/index.html', function () {
        // Setup Querying based on DOM
        $ = dom.load(fs.readFileSync('public/index.html'));

        expect(
            $('#logo').attr('src')
        ).to.equal(
            logo
        );

    });
});

