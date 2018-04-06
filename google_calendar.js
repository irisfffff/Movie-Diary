/* Implement Google Calendar Api using JavaScript
 * Authorize/Unauthorize
 * List watching history
 */

// Client ID and API key from the Developer Console
var CLIENT_ID = '700252565922-gd2boukbl0n9eaqcc5mptjtd4qmqkdvo.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDw5hy0gunhDF_T62MY_gd4nl3B00xcjyc';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //listWatchingHistory();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {

    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}


/**
 * Print the summary and start date of the 1000 thoughts from the start in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listWatchingHistory() {
    gapi.client.calendar.events.list({
        'calendarId': '9ggc9012bj31v20ru00q4a36as@group.calendar.google.com',
        //'timeMax': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 1000,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        /*
         if (events.length > 0) {
         for (i = 0; i < events.length; i++) {
         var event = events[i];
         var when = event.start.dateTime;
         if (!when) {
         when = event.start.date;
         }
         }
         console.log(events);
         } else {
         }*/
        realGet(events);
    });
}

/**
 * Insert a new watching record(event) into the Movie Diary calendar
 */
function insertNewWatching() {
    var title = document.getElementById("title").value;
    var date = document.getElementById("date").value;
    var description = document.getElementById("description").value;
    if (title == "" || date == "") {
        return;
    }
    var event = {
        'summary': title,
        'description': description,
        'colorId': '4',
        'start': {
            'dateTime': date + 'T19:30:00+02:00'
        },
        'end': {
            'dateTime': date + 'T21:30:00+02:00'
        }
    };
    console.log(event);

    var request = gapi.client.calendar.events.insert({
        'calendarId': '9ggc9012bj31v20ru00q4a36as@group.calendar.google.com',
        'resource': event
    });

    request.execute(function (event) {
        //appendPre('Event created: ' + event.htmlLink);
        listWatchingHistory();
    });
}

/**
 * Print the summary and start date of specific records according to
 * movie title or watching date
 */
function listSpecificHistory() {
    var title = document.getElementById("con_title").value;
    var date = document.getElementById("con_date").value;
    gapi.client.calendar.events.list({
        'calendarId': '9ggc9012bj31v20ru00q4a36as@group.calendar.google.com',
        //'timeMax': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        var results = new Array();

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];

                if (title == "" && date != "") {
                    if (event.start.dateTime.substr(0, 10) == date) {
                        results.push(event);
                    }
                } else if (date == "" && title != "") {
                    if (event.summary.toLowerCase() == title.toLowerCase()) {
                        results.push(event);
                    }
                } else if (title == "" && date == "") {
                    return;
                } else {
                    if (event.summary.toLowerCase() == title.toLowerCase() && event.start.dateTime.substr(0, 10) == date) {
                        results.push(event);
                    }
                }
            }
            console.log(events);
        } else {
            return;
        }
        if (results.length > 0) {
            realGet(results);
        } else {
            alert("No record!");
        }

    });
}

/**
 * Delete a record from the calendar according to movie title
 */
function deleteHistory() {
    var title = document.getElementById("de_title").value;
    gapi.client.calendar.events.list({
        'calendarId': '9ggc9012bj31v20ru00q4a36as@group.calendar.google.com',
        //'timeMax': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        var result = "";

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];

                if (title == "") {
                    return;
                } else {
                    if (event.summary.toLowerCase() == title.toLowerCase()) {
                        result = event;
                        break;
                    }
                }
            }
        } else {
            return;
        }
        if (result != "") {
            var request = gapi.client.calendar.events.delete({
                'calendarId': '9ggc9012bj31v20ru00q4a36as@group.calendar.google.com',
                'eventId': result.id
            });

            request.execute(function (event) {
                listWatchingHistory();
            });
        } else {
            alert("No record!");
        }

    });
}

/**
 * Call GET method of my web service, pass all the movie titles
 */
function realGet(diary) {
    console.log(diary);
    var diary_short = new Array();
    if (diary.length == 0)
        return;
    for (var i = 0; i < diary.length; i++) {
        var event = diary[i];
        diary_short.push("{\"Title\": \"" + event.summary + "\"}");
    }
    diary_short = "[" + diary_short + "]";
    /*
     if (diary.length > 6) {
     diary = diary.slice(-6);
     }*/
    var url = 'mashup.php';
    $.get(url, {diary: JSON.parse(diary_short)},
            function (data) {
                var resp = JSON.parse(data);
                var rstgrid = "";
                var length = resp.length;
                rstgrid += "<header class=\"top-bar\"><h2 class=\"top-bar__headline\">Latest watches</h2>" + "<div class=\"filter\"><span>Filter by:</span><span class=\"dropdown\">Time</span></div></header>";
                var rstdetail = "";
                /*var rslt = "";
                 rslt += "<section class=\"grid\">" + "<header class=\"top-bar\"><h2 class=\"top-bar__headline\">Latest watches</h2>"
                 + "<div class=\"filter\"><span>Filter by:</span><span class=\"dropdown\">Time</span></div></header>";*/
                for (var i in resp) {
                    rstgrid += "<a class=\"grid__item\" href=\"#\"><h2 class=\"title title--preview\">";
                    rstgrid += resp[i].Title;
                    rstgrid += "</h2><div class=\"loader\"></div><span class=\"category\">";
                    rstgrid += diary[length - i - 1].description + "</span>";
                    if (resp[i].Details) {
                        rstgrid += "<div class=\"meta meta--preview\"><img class=\"meta__avatar\" src=\"https://image.tmdb.org/t/p/w300/" + resp[i].Poster
                                + "\" alt=\"poster" + i + "\" width=\"75%\" height=\"75%\" />";
                        if (resp[i].Overview.length > 300) {
                            rstgrid += "<p>" + resp[i].Overview.substr(0, 300) + " ...</p>";
                        } else {
                            rstgrid += "<p>" + resp[i].Overview + "</p>";
                        }
                        rstgrid += "<span class=\"meta__date\"><i class=\"fa fa-calendar-o\"></i> "
                                + diary[length - i - 1].start.dateTime.substr(0, 10) + "</span>"
                                + "<span class=\"meta__reading-time\"><i class=\"fa fa-clock-o\"></i> " + resp[i].Score + "</span></div>";
                    } else {
                        rstgrid += "<div class=\"meta meta--preview\"><img class=\"meta__avatar\" width=\"75%\" height=\"75%\" />";
                        rstgrid += "<p></p>";
                        rstgrid += "<span class=\"meta__date\"><i class=\"fa fa-calendar-o\"></i> "
                                + diary[length - i - 1].start.dateTime.substr(0, 10) + "</span>"
                                + "<span class=\"meta__reading-time\"><i class=\"fa fa-clock-o\"></i> No record</span></div>";
                    }

                    rstgrid += "</a>";


                    rstdetail += "<article class=\"content__item\"><span class=\"category category--full\">Mood of the day</span>";
                    rstdetail += "<h2 class=\"title title--full\">" + resp[i].Title + "</h2><div class=\"meta meta--full\">";
                    if (resp[i].Details) {
                        rstdetail += "<img class=\"meta__avatar\" src=\"https://image.tmdb.org/t/p/w300/" + resp[i].Poster
                                + "\" alt=\"poster" + i + "\" /><span class=\"meta__author\">" + resp[i].Release + "</span>";
                    } else {
                        rstdetail += "<img class=\"meta__avatar\" /><span class=\"meta__author\">No record</span>";
                    }
                    rstdetail += "<span class=\"meta__date\"><i class=\"fa fa-calendar-o\"></i>" + diary[length - i - 1].start.dateTime.substr(0, 10) + "</span>"
                            + "<span class=\"meta__reading-time\"><i class=\"fa fa-clock-o\"></i> " + resp[i].Score + "</span></div>";
                    rstdetail += "<p>" + diary[length - i - 1].description + "</p><p>" + resp[i].Overview + "</p></article>";

                }
                rstgrid += "<footer class=\"page-meta\"><span>Load more...</span></footer>";
                /*
                 rslt += rstgrid + "<footer class=\"page-meta\"><span>Load more...</span></footer>";
                 rslt += "</section><section class=\"content\"><div class=\"scroll-wrap\">" + rstdetail;
                 rslt += "</div><button class=\"close-button\"><i class=\"fa fa-close\"></i><span>Close</span></button></section>";
                 */

                //$('#detail').html(testcontent);
                //$('#theGrid').html(rslt);
                $('#diary').html(rstgrid);
                $('#detail').html(rstdetail);
            });
}