const fs = require('fs');
const expect = require('chai').expect;
const dom = require('cheerio');
const jira = require('tests/jira.js');

let failedTests = {};

describe('OK-7', function () {
    //const logo = "/resources/erhvervsstyrelsen_logo.png";
    const logo = "/resources/netcompany_logo.png";

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
            }
        });
    });
});

after( () => {
    let issueExists = false;
    let failedComment = "Greetings! Unfortunately the following userstories is failing with your commit: \n\n";
    for(let userstory in failedTests){
        if(failedTests[userstory].length > 0){
            failedComment += 'https://demoportal.atlassian.net/browse/' + userstory + '\n'
            issueExists = true;
        }
    }
    failedComment += "\n Best regards, \n Jenkins!";
    if(issueExists){
        fs.writeFileSync(__dirname + '/FAIL', failedComment);
    }
});
