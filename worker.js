var redis = require("redis"),
    client = redis.createClient();

let isWorking;
const doWork = () => {
	clearTimeout(isWorking);
    client.spop('jobs', (err, data) => {
        console.log(err, data);
        isWorking = setTimeout(doWork, (Math.floor(Math.random() * Math.floor(5) + 1))*1000); // 1 - 5 sekunders vent
    });
};

doWork();