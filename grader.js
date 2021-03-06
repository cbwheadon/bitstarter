#!/usr/bin/node
/*
Automatically grade files for the presenece of specified HTML tags/attributes. Uses commander.js and cheerio. Teaches command line application development and basic DOM parsing.
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var sys = require('util');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
	}
    return instr;
};

var getResp = function(url){
    var result = rest.get(url).on('complete', function(response) { response;
								   });
    return result;
};

var cheerioHtmlFile = function(htmlFile){
    return cheerio.load(fs.readFileSync(htmlFile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, typ, checksfile){
    if (typ==0){
      $ = cheerioHtmlFile(htmlfile);
    } else {
      $ = cheerio.load(htmlfile);
    }
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks){
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn){
    // Workaround
    return fn.bind({});
};

if(require.main == module){
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
        .option('-u, --url <url>', 'Path to html file', clone(getResp))
	.parse(process.argv);
    if (program.file) {
      var checkJson = checkHtmlFile(program.file, 0, program.checks);} else {
      var checkJson = checkHtmlFile(program.url, 1, program.checks);}
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
    
