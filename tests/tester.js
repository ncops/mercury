var JiraApi = require('jira-client');

var jira = new JiraApi({
    protocol: 'https',
    host: 'demoportal.atlassian.net',
    username: '',
    password: '',
    apiVersion: '2',
    strictSSL: true
});
let myIssue = {
    "type": {
        "name": "Test"
    },
    "inwardIssue": {
        "key": "OK-26"
    },
    "outwardIssue": {
        "key": "OK-24"
    }
};
jira.issueLink(myIssue)
    .then(issue => {
        console.log(issue);
    })
    .catch(err => {
        console.error(err);
    });

