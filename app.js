var fs = require("fs");
var moment = require("moment");
var axios = require("axios");
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var input = process.argv[3];
errorLog(command, input)
liriBot(command)

function BandsInTown () {
    var artist = input
    axios("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=anyplaceholderwilldo")
    .then(function(response) {
        response.data.forEach((event) => {
            var date = moment(event.datetime)
            console.log("-------------------------------------")
            console.log("Location:" + event.venue.name)
            console.log("City: " + event.venue.city)
            console.log("Date: " + date.format("MM/DD/YYYY"))
        })
    })
    .catch(function(error) {
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request)
        } else {
            console.log(error.message);
        }
        console.log(error.config)
    })
};

function Spotifier (input) {
    var song = input
    spotify.search({type: 'track', query: song}, function (err, data) {
        if (err){
            console.log(err)
        }
        playList = data.tracks.items
        playList.forEach(function(element){
            console.log("-------------------------------------------")
            console.log(element.artists[0].name)
            console.log(element.name)
            console.log(element.href)
            console.log(element.album.name)
        })
    })
};

function movies (input) {
    var movie = input
    axios("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
        console.log("Title: " + response.data.Title)
        console.log("Year: " + response.data.Year)
        console.log("imdb: " + response.data.imdbRating)
        console.log("Rotten Tomatoes: " + response.data.Ratings[1].value)
        console.log("Country: " + response.data.Country)
        console.log("Language: " + response.data.Language)
        console.log("Plot: " + response.data.Plot)
        console.log("Actors: " + response.data.Actors)
    })
    .catch(function(error) {
        if (error.response) {
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request)
        } else {
            console.log(error.message);
        }
        console.log(error.config)
    })
}
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error){
            console.log(error)
        }
        var data = data.split(",")
        input = data[1]
        liriBot(data[0])
    })
};

function liriBot (command) {
    switch (command) {
        case "concert-this":
            BandsInTown(input);
            break;
        case "spotify-this-song":
            Spotifier(input);
            break;
        case "movie-this":
            if(!input){
                input = "Mr. Nobody"
            }
            movies(input);
            break;
        case "do-what-it-says":
            doWhatItSays(input)
            break;
        default:
            console.log("Enter a command")
    }
}
function errorLog (command, input) {
    fs.appendFile("log.txt", command + ", " + input + ", ", (error) => {
        if (error) {
            console.log(error)
        }
    })
}