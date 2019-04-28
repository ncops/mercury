const config = {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS
    },
    ui: {
        public_port: 3000,
        socket_io_port: 3001
    }
};

var redis = require("redis"),
    client = redis.createClient(config.redis);

let isWorking;
const doWork = () => {
	clearTimeout(isWorking);
    client.spop('jobs', (err, data) => {
        console.log(err, data);
        isWorking = setTimeout(doWork, (Math.floor(Math.random() * Math.floor(3) + 1))*1000); // 1 - 5 sekunders vent
    });
};

doWork();