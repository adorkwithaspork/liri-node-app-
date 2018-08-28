require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var moment = require('moment');
var fs = require('fs');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var thing = process.argv[3];

if (command === "do-what-it-says"){
  doWhatItSays();
  // command = data[0];
  // thing = data [1];
};

switch (command) {
  case 'spotify-this-song':
    spotifyThis(thing);
    break;
  case 'movie-this':
    movieThis(thing);
    break;
  case 'concert-this':
  concertThis(thing);
  break;
 };



function spotifyThis(song) {
  if (!thing) {
    song = "Ace of Base The sign";
  };

    spotify.search({
      type: 'track',
      query: song
    }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      } else {
        var response = data.tracks.items
        response.forEach(song => {
          console.log(song.name)
          console.log(song.artists[0].name)
          console.log(song.album.name)
          console.log(song.href)
          console.log('----------------------$$$-----------------------')
        });
      };
    });
  };


function movieThis(movie){
  if (!thing) {
    movie = "Mr.Nobody";
  };
  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
      if (!error && response.statusCode === 200) {
      console.log(movie);
      console.log("Year: " + JSON.parse(body).Year);
      console.log(movie + " has an IMBD rating of: " + JSON.parse(body).imdbRating);
      console.log(movie + " has a Rotten Toamatoes rating of: " + JSON.parse(body).Ratings[1].Value);
      console.log(movie + " was produced in: " + JSON.parse(body).Country)
      console.log(movie + " Language: " + JSON.parse(body).Language);
      console.log(movie + " Plot: " + JSON.parse(body).Plot);
      console.log(movie + " Actors: " + JSON.parse(body).Actors);   
      // console.log(response);
      }
  })
}

function concertThis(band) {
  request("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp", function (error, response, body) {
    // console.log("error",error)
    // console.log("response",response)
    // console.log("band", band)
    // console.log("body",body)
    
    if (!error && response.statusCode == 200) {
      var bandArray = JSON.parse(body)
      bandArray.forEach(function (event) {
        console.log("Venue Name: ",event.venue.name)
        console.log("Venue City: ",event.venue.city)
        console.log("When: ",moment(event.datetime).format("LLL"))
        console.log("-------------$$$$$$$$$$$$$$$--------------")

      })
    } else {
      console.log(error)
    };
  })
}

function doWhatItSays(){
  fs.readFile('doMe.txt', 'utf8', function(err, data){
      data = data.split(',');
      console.log(data);
      command = data[0];
      thing = data[1];

      switch (command) {
        case 'spotify-this-song':
          spotifyThis(thing);
          break;
        case 'movie-this':
          movieThis(thing);
          break;
        case 'concert-this':
        concertThis(thing);
        break
       };
      return 
     
  });
}

fs.appendFile("log.txt", "[" + command + ", " + thing + "]", function(err) {
  if (err) {
    return console.log(err);
  }
});