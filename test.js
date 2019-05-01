const fs = require('fs');
const expect = require('chai').expect;
const dom = require('cheerio');
const xray = require(__dirname + '/tests/xray');

let failedTests = {};

describe('OK-7', function () {
    const logo = "/resources/erhvervsstyrelsen_logo.png";

    it('Logo file must reside in resources', function () {
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


    before(() => {
        const userstory = this.title;
        failedTests[userstory] = [];
        afterEach(function() {
            if(this.currentTest.state === "failed"){
                failedTests[userstory].push(this.currentTest);
                process.env['BUILD_URL'] = 'https://google.dk/';
            }
        });
    });
});


