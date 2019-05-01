const fs = require('fs');
const expect = require('chai').expect;
const dom = require('cheerio');
const jira = require('./tests/jira.js');

let tests = {};

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
        let userstory = this.title;
        tests[userstory] = {
            success: [],
            failure: []
        };

        afterEach(function() {
            if(this.currentTest.state === "failed"){
                tests[userstory].failure.push(this.currentTest);
            } else {
                tests[userstory].success.push(this.currentTest);
            }
        });
    });
});

after( () => {
    // Let Jenkins know in GitHub which user story is failing.
    let issueExists = false;
    let failedComment = "Greetings! Unfortunately the following userstories is failing with your commit: \n\n";
    for(let userstory in tests.failure){
        if(tests[userstory].failure.length > 0){
            failedComment += 'https://demoportal.atlassian.net/browse/' + userstory + '\n'
            issueExists = true;
        }
    }
    failedComment += "\n Best regards, \n Jenkins!";
    if(issueExists){
        fs.writeFileSync(__dirname + '/FAIL', failedComment);
    } else {
        fs.writeFileSync(__dirname + '/FAIL', "Awesome commit! Well done :)");
    }

    // Let us create automatically all programmically made tests into the Jira user story.
    let k = new jira(tests);
});
