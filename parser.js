var request = require('request');
var cheerio = require('cheerio');

var options = {
	//url: 'http://www.zillow.com/homes/164-Forest-St-Arlington,-MA-02474_rb/',
	//url: 'https://www.redfin.com/MA/Arlington/164-Forest-St-02474/home/8434134',
	url: 'http://vow.mlspin.com/idx/details.aspx?mls=71881590&aid=BB985691',
	method: 'GET',
	headers: {
//		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//		'Upgrade-Insecure-Requests': 1,
//		'Host': 'www.redfin.com',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36'
	}
};

var parse = function (body) {
	var $ = cheerio.load(body);
	var tmp = $('.Details');
	console.log('tmp = ' + tmp.html());
//	console.log($.html());
};

request.get(options, function (error, response, body) {
	if (response.statusCode === 200) {
		var result = parse(body);
	} else {
		console.log('error = ' + error);
	}
});
	
