/**
 * Code as adapted from https://scotch.io/tutorials/scraping-the-web-with-node-js
 * Additional documentation on Cheerio found here - https://www.npmjs.com/package/cheerio
 * Using the web schedule at http://www.goal.com/en-us/live-scores
*/

var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res) {

    // Constants
    let TODAY = '.today';
    let MATCH_DATA = '.match-main-data-link'
    let MATCH_TIME = '.match-status';
    let TEAMS = '.match-teams';
    let TEAMS_DATA = '.match-data';
    let TEAM_NAME = '.team-name';
    let HOME_TEAM = '.team-home';
    let AWAY_TEAM = '.team-away';

    let OUTPUT_FILE = 'output.json';

    var url = 'http://www.goal.com/en-us/live-scores';

    var day, games;
    var json = { day : "", games : [] };

    request(url, function(error, response, html){
        if(!error) {
            var $ = cheerio.load(html);

            $(TODAY).filter(function(){
                var data = $(this);
                today = data.children().first().text();
                json.day = today;
            });

            $(MATCH_DATA).each(function(i, elem){
                var data = $(this);
                var competition = data.parent().parent().parent().parent().find('.competition-title').text();
                var status = data.find(MATCH_TIME).children().first().text();
                var time = data.find(MATCH_TIME).children().last().text();
                var match = data.find(TEAMS).find(TEAMS_DATA);
                var home_team = match.find(HOME_TEAM).find(TEAM_NAME).text();
                var away_team = match.find(AWAY_TEAM).find(TEAM_NAME).text();
                var inner_json = { "home_team" : home_team, "away_team" : away_team, "time" : time, "status" : status, "competition" : competition };
                json.games.push(inner_json);
            });


            fs.writeFile(OUTPUT_FILE, JSON.stringify(json, null, 4), function(err){
                if(!err) {
                    console.log('File Written successfully');
                } else {
                    console.log('Error' + err);
                }
            })

            res.send('Check your console!');
        }
    }) 

});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
