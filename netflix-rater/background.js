// Load data file
var ratings;
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		ratings = JSON.parse(xhr.responseText);
	}
}
xhr.open("GET", chrome.extension.getURL('/betyg.txt'), true);
xhr.send();

// This is what does the work for a given movie
var tabIds = [];
function rate(movie) {
	var starClass;
	if (movie.rating == 0) {
		starClass = "rvnorec";
	} else {
		starClass = "rv" + movie.rating;
	}
	console.log(movie.url + " " + starClass);
	chrome.tabs.create({"url": movie.url, "active": false}, function(tab) {
		//console.log("Opened " + tab.id);
		tabIds.push(tab.id);
		if (tabIds.length > 10) {
			var tabId = tabIds.shift();
			//console.log("Removing " + tabId);
			chrome.tabs.remove(tabId);
		}
		chrome.tabs.executeScript(tab.id, {"code": "var star = document.getElementsByClassName('" + starClass + "')[0]; if (typeof star != 'undefined') {()star.click();console.log('Rated "+movie['Orginaltitel']+"');}"});
	});
}

function imdbToNetflix(movie) {
	if (typeof movie === 'undefined')  { 
		clearInterval(intervalId); 
		console.log('Done!');
		return; 
	}
	//Filmtipset removes the "tt" and padding zeroes from imdb id, add it back
	var imdbID = "tt" + ("0000000"+movie['IMDB#']).slice(-7);
	var freebaseUrl = "https://www.googleapis.com/freebase/v1/mqlread/?lang=%2Flang%2Fen&query=[{+%22name%22%3A+null%2C+%22imdb_id%22%3A+%22" + imdbID + "%22%2C+%22netflix_id%22%3A+null%2C+%22type%22%3A+%22%2Ffilm%2Ffilm%22+}]";
	var response;
	//console.log(freebaseUrl);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			response = JSON.parse(xhr.responseText);
			if (response.result[0].netflix_id) {
				movie.rating = movie['Ditt betyg'];
				movie.url = "http://movies.netflix.com/Movie/" + response.result[0].netflix_id;
				rate(movie);
			} else {
				console.log("Found no Netflix entry for " + movie.Titel);
				imdbToNetflix(ratings.shift());
			}
			//console.log(response);
		}
	}
	xhr.open("GET", freebaseUrl, true);
	xhr.send();
}

// The action starts when the extension is clicked
var intervalId;
chrome.browserAction.onClicked.addListener(function() {
	// Try to rate each movie every 5 seconds
	console.log("Start rating");
	clearInterval(intervalId);
	intervalId = setInterval(function() { imdbToNetflix(ratings.shift())}, 5000);
});
