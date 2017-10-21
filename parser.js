'use strict';

var request = require('request');
var cheerio = require('cheerio');

var options = {
	method: 'GET',
	headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36'
	}
};

var parseRedfin = function (body) {
	var assembledAddress = /"assembledAddress":"(.*?)",/.exec(body)[1];
	var city = /"city":"(.*?)",/.exec(body)[1];
	var state = /"state":"(.*?)",/.exec(body)[1];
	var zip = /"zip":"(.*?)",/.exec(body)[1];
	var lotSize = /"lotSize":(.*?),/.exec(body)[1];
	var price = /"amount":(.*?),/.exec(body)[1];
	var beds = /"beds":(.*?),/.exec(body)[1];
	var baths = /"baths":(.*?),/.exec(body)[1];
	var year = /"yearBuilt":(.*?),/.exec(body)[1];
	var daysOnRedfin = /"daysOnRedfin":(.*?),/.exec(body)[1];
	var livingSize = /"sqFt":\{"value":(.*?)\}/.exec(body)[1];
	var type = /\{"header":"Style","content":(.*?)"\},/.exec(body)[1];
	var openHouse = /Open House,\s(.*?),\s(.*?),\s([a-z0-9]*?-[a-z0-9]*?)\s/.exec(body);
	if (openHouse) {
		openHouse = openHouse[1]+ ',' + openHouse[2] + ',' + openHouse[3];
	}

	return {
		address: assembledAddress + ', ' + city + ', ' + zip + ' ' + state,
		livingSize: livingSize,
		lotSize: lotSize,
		beds: beds,
		baths: baths,
		type: type,
		year: year,
		price: '$' + price,
		days: daysOnRedfin + ' days',
		openHouse: openHouse
	};
};

var parseZillow = function (body) {
	var $ = cheerio.load(body);
	var str = $('.google-ad-config')[0].text();
	console.log('str= ' + str);
	var ob = JSON.parse(str);
	return;
};

var sqft2sqm = function (sqftStr) {
	var n = Number(sqftStr);
	return Math.ceil(n/10.764);
};

var main = function (options) {
	var url = process.argv[2];
	options.url = url;
	request.get(options, function (error, response, body) {
	if (response.statusCode === 200) {
		if (url.indexOf('redfin') !== -1) {
			var result = parseRedfin(body);
			console.log('address: ' + result.address);
			console.log('type: ' + result.type + ', built in: ' + result.year);
			console.log(result.beds + ' bedrooms, ' + result.baths + ' baths');
			console.log('living Area: ' + result.livingSize + ' sqft (' + sqft2sqm(result.livingSize) + ' SquareMeters)');
			console.log('lot size: ' + result.lotSize + ' sqft (' + sqft2sqm(result.lotSize) + ' SquareMeters)');
			console.log('price: ' + result.price + ', ' + result.days + ' on Redfin');
			console.log('OpenHouse: ' + result.openHouse);
		} else if (url.indexOf('zillow') !== -1) {
			parseZillow(body);
		} else {
		}
	} else {
		console.log('error = ' + error);
	}
});
}
	
main(options);
