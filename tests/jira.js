var JiraApi = require('jira-client');

var jira = new JiraApi({
    protocol: 'https',
    host: 'demoportal.atlassian.net',
    username: "ruth@netcompany.com",
    password: "VWscGkfimDYFSBmjBK1kB53D",
    apiVersion: '2',
    strictSSL: true
});

class jiraController {
    constructor(tests) {
        this.tests = tests;
        this.testnames = {};
        this.fetchedTests = {};
        this.mustBeCreatedInJira = {};

        for(let userstory in this.tests ){
            this.testnames[userstory] = {};

            ['failure', 'success'].forEach(state => {
                if(this.tests[userstory][state].length > 0){
                    this.tests[userstory][state].forEach(test => {
                        this.testnames[userstory][test.title] = test;
                    });
                }
            });

            this.fetchTestsRegardingIssue(userstory);
        }

    }
    fetchTestsRegardingIssue(userstory) {
        this.fetchedTests[userstory] = {};
        jira.findIssue(userstory)
            .then((issue) => {
                issue.fields.issuelinks.forEach(linkedIssue => {
                    if(linkedIssue.inwardIssue !== 'undefined'){
                        if(linkedIssue.inwardIssue && linkedIssue.inwardIssue.fields !== 'undefined'){
                            if(linkedIssue.inwardIssue.fields.issuetype !== 'undefined' && linkedIssue.inwardIssue.fields.issuetype.name === 'Test'){
                                let name = linkedIssue.inwardIssue.fields.summary;
                                this.fetchedTests[userstory][name] = linkedIssue.inwardIssue.fields.issuetype.id;
                            }
                        }
                    }
                });

                this.compareTests(userstory);
            });

    }
    compareTests(userstory){
        for(let test in this.testnames[userstory]){
            if(this.fetchedTests[userstory][test] != undefined){
                this.testnames[userstory][test].jiraId = this.fetchedTests[userstory][test];
            } else {
                if(this.mustBeCreatedInJira[userstory] == undefined){
                    this.mustBeCreatedInJira[userstory] = {};
                }

                this.mustBeCreatedInJira[userstory][test] = true;
            }
        }
        this.createMissingTests(userstory);
    }
    createMissingTests(userstory){
        let counter = 0;
        for(let test in this.mustBeCreatedInJira[userstory]){
            jira.addNewIssue({
                "fields": {
                    "project":
                        {
                            "key": "OK"
                        },
                    "summary": test,
                    "issuetype": {
                        "name": "Test"
                    }
                }
            }).then(issue => {
                this.testnames[userstory][test].jiraId = issue.id;
                this.testnames[userstory][test].jiraKey = issue.key;
                counter++;

                if(counter === Object.keys(this.mustBeCreatedInJira[userstory]).length){
                    this.createLinksWithMissingTests(userstory);
                }
            })
            .catch(err => {
                console.error(err);
                counter++;

                if(counter === Object.keys(this.mustBeCreatedInJira[userstory]).length){
                    this.createLinksWithMissingTests(userstory);
                }
            });

        }
    }
    createLinksWithMissingTests(userstory){
        for(let test in this.testnames[userstory]){
            jira.issueLink({
                "type": {
                    "name": "Test"
                },
                "inwardIssue": {
                    "key": this.testnames[userstory][test].jiraKey
                },
                "outwardIssue": {
                    "key": userstory
                }
            })
            .then(issue => {

            })
            .catch(err => {
                console.error(err);
            });
        }
    }

}


module.exports = jiraController;
