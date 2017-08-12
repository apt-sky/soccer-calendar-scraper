/**
 * Code as adapted from https://scotch.io/tutorials/scraping-the-web-with-node-js
 * Additional documentation on Cheerio found here - https://www.npmjs.com/package/cheerio
*/

var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res) {

    var url = '';
    request(url, function(error, response, html){
        if(!error) {
            var $ = cheerio.load(html);

            var day, time, league, game;
            var json = { day = "", games = [] };

            $('.today').filter(function(){
                var data = $(this);
                today = data.children().first().text();
                json.day = today;
            });

            $('.match-main-data-link').each(function(i, elem){
                var data = $(this);
                var time = data.find('.match-status').children().first().text();
                var match = data.find('.match-teams').find('.match-data');
                var home_team = match.find('.team-home').find('.team-name').text();
                var away_team = match.find('.team-away').find('.team-name').text();
                var inner_json = { "home_team" = home_team, "away_team" = away_team, "time" = time }'
                json.game.push(inner_json);
            });
        }
    }) 


    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        if(!err) {
            console.log('File Written successfully');
        } else {
            console.log('Error' + err);
        }
    })

    res.send('Check your console!');

});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
