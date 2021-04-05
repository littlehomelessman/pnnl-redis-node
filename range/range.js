const express = require('express');
const moment = require('moment');

let router = express.Router();

function convertToJson(dataString, delimiter) {
	if (!dataString) {
		return {};
	}

	dArray = dataString.split(delimiter);
	var dataObject = {};

	for (const [i, d] of dArray.entries()) {
		if (i % 2 !== 0) {
			dataObject[dArray[i - 1]] = d;
		}
	}
	return dataObject;
}

async function queryByDate(dataType, startDate, endDate, client) {
	const start = moment(startDate);
	const end = moment(endDate);
	const objectArr = {};

	for (const d = moment(start); d.diff(end, 'days') <= 0; d.add(1, 'days')) {
		const dateTime = d.format('YYYY-MM-DD');

		let key = dataType.concat(',', dateTime);
		const dataString = await client.getAsync(key);
		const dataObject = convertToJson(dataString, ',');

		objectArr[dateTime] = dataObject;
	}

	return objectArr;
}

// Cache middleware
async function cache(req, res, next) {
	const client = req.redis_config.client;
	const { dataType, startDate, endDate } = req.params;

	if (!(dataType == 'temperature' || dataType == 'airflow')) {
		res.status(400).json({
			msg: `No data available for ${dataType}`,
		});
		return;
	}

	const dataObject = await queryByDate(dataType, startDate, endDate, client);

	if (dataObject) {
		res.status(200).json(dataObject);
	} else {
		res.status(400).json({ msg: `No data available for this range` });
	}
}

router.get('/:dataType/:startDate/:endDate', cache);

module.exports = router;
