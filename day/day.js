const express = require('express');
let router = express.Router();

function convertToJson(dataString, delimiter) {
	dArray = dataString.split(delimiter);

	console.log(dArray);
	var dataObject = {};

	for (const [i, d] of dArray.entries()) {
		if (i % 2 !== 0) {
			dataObject[dArray[i - 1]] = d;
		}
	}
	return dataObject;
}

// Cache middleware
function cache(req, res) {
	const client = req.redis_config.client;
	const { dataType, dateTime } = req.params;

	if (dataType == 'temperature' || dataType == 'airflow') {
		key = dataType.concat(',', dateTime);
	} else {
		res.status(400).json({ msg: `Data for ${dataType} does not exist` });
		return;
	}

	client.get(key, (err, data) => {
		if (err) throw err;

		if (data !== null) {
			dataObject = convertToJson(data, ',');
			res.status(200).json(dataObject);
		} else {
			res
				.status(400)
				.json({ msg: `No data found for ${dateTime} in ${dataType}` });
		}
	});
}

router.get('/:dataType/:dateTime', cache);

module.exports = router;
