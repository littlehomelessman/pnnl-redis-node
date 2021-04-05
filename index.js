const express = require('express');
const redis = require('redis');
const Promise = require('bluebird');
const https = require('https');
const path = require('path');
const fs = require('fs');

const dayRouter = require('./day/day');
const rangeRouter = require('./range/range');

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;
const REDIS_HOST = 'localhost';

const client = redis.createClient(REDIS_PORT, REDIS_HOST);
Promise.promisifyAll(client);

const app = express();

app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('X-Powered-By', ' 3.2.1');
	res.header('Content-Type', 'application/json;charset=utf-8');
	next();
});

function grantClient(req, res, next) {
	req.redis_config = {
		client: client,
	};
	next();
}

app.use('/day', grantClient, dayRouter);
app.use('/range', grantClient, rangeRouter);

const sslServer = https.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
	},
	app
);

sslServer.listen(3443, () => console.log('Secure Server on 3443'));

app.listen(5000, () => {
	console.log(`App listening on port ${PORT}`);
});
