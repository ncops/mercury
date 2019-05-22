const fs = require('fs');
const expect = require('chai').expect;
const dom = require('cheerio');
const jira = require('./tests/jira.js');

let tests = {};

describe('OK-65', function () {
    const logo = "/resources/ufst_logo.png";
    //const logo = "/resources/netcompany_logo.png";

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
    let failedComment = "Greetings! Unfortunately we have the following issues with your commit: \n\n";
    for(let userstory in tests){
        if(tests[userstory].failure.length > 0){
            failedComment += 'Userstory: ' + userstory + ' - https://demoportal.atlassian.net/browse/' + userstory + '\n';
            failedComment += '-- Failed with the following tests: \n';
            tests[userstory].failure.forEach(test => {
                failedComment += "---- Test: " + test.title + "\n";
                failedComment += "---- Error: " + test.err.message + "\n";
            });
            issueExists = true;
        }
    }
    failedComment += "\nBest regards, \nJenkins!";
    if(issueExists){
        fs.writeFileSync(__dirname + '/FAIL', failedComment);
    } else {
        fs.writeFileSync(__dirname + '/FAIL', "Awesome commit! Well done :)");
    }

    // Let us create automatically all programmically made tests into the Jira user story.
    let k = new jira(tests);
});
