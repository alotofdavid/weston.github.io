// Parameters. These should change every competition.
// You can get the COMPETITION_ID by looking at the cid url param
// in cubecomps.
COMPETITION_NAME = "WCCT LA"
COMPETITION_ID = 3345


// Settings (These should not have to change every competition)
BASE_CUBECOMPS_URL = "http://m.cubecomps.com/competitions/" + COMPETITION_ID + "/"
RESULT_TABLE_ID = "results-table"
TOP_RESULTS_COUNT = 16


// "top" mode: print the top 16 results of a round so far
// "round" mode: scroll through all results of a round
// "competition" mode: scroll through the latest round for all events
TOP_MODE = "top"
ROUND_MODE = "round"


function main(){
    var mode = getParameter("mode")
    // see eventNameToID
    var eventID = eventNameToID(getParameter("event"))
    // 1 2 3 4 or 5
    var round = getParameter("round")
    if (mode == ROUND_MODE) {
        handleRoundMode(eventID, round)
    } else {
        handleTopMode(eventID, round)
        // Set timeout
    }
}

function handleTopMode(eventID, round) {
    var url = createCubecompsRoundResultsURL(eventID, round)
    var roundData = getResponse(url)
    if (roundData.length == 0) {
        return
    }
    placeTableHeaders(roundData)
    for (var i = 0; i < TOP_RESULTS_COUNT; i++) {
        var competitorResult = roundData[i]
        appendResultRow(competitorResult)
    }
}


function handleRoundMode(competition_id, event_id, round) {
    var url = createCubecompsRoundResultsURL(event_id, round)
}


function appendResultRow(resultData) {
    var table = document.getElementById(RESULT_TABLE_ID);
    var newRow = document.createElement("tr")
    var columns = ["position", "name", "country", "t1", "t2", "t3", "t4", "t5", "mean", "average", "best"]
    for (var i = 0; i < columns.length; i++) {
        console.log(resultData)
        columnString = columns[i]
        if (!(columnString in resultData)) {
            continue
        }
        var col = document.createElement("td")
        col.innerHTML = resultData[columnString]
        newRow.append(col)
    }
    table.appendChild(newRow)
}

function placeTableHeaders(roundData) {
    // Some events only have 3 solves.
    var headers = ["#", "Name", "Country", "Solve 1", "Solve 2", "Solve 3"]
    if ("t4" in roundData[0] && "t5" in roundData[0]) {
        headers.push("Solve 4")
        headers.push("Solve 5")
        headers.push("Average")
    } else {
        headers.push("Mean")
    }
    headers.push("Best")
    var table = document.getElementById(RESULT_TABLE_ID);
    var row = document.createElement("tr")
    for (var i = 0; i < headers.length; i++) {
        header = headers[i]
        var column = document.createElement("td")
        column.innerHTML = header
        row.appendChild(column)
    }
    table.appendChild(row)
}



function createCubecompsRoundResultsURL(eventID, round) {
    var url = BASE_CUBECOMPS_URL
    url += "events/" + eventID
    url += "/rounds/" + round
    url += "/results.json"
    return url
}


function getResponse(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false );
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}



function getParameter(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function eventNameToID(name) {
    name = name.toLowerCase()
    if (name == "333") return 1
    if (name == "222") return 2
    if (name == "444") return 3
    if (name == "555") return 4
    if (name == "666") return 5
    if (name == "777") return 6
    if (name == "clock") return 7
    if (name == "mega") return 10
    if (name == "pyra") return 11
    if (name == "squan") return 12
    if (name == "oh") return 13
    if (name == "feet") return 14
    if (name == "fmc") return 15
    if (name == "bld" || name == "3bld") return 16
    if (name == "4bld") return 17
    if (name == "5bld") return 18
    if (name == "mbld") return 19
    if (name == "skweb") return 20
    console.log("COULD NOT IDENTIFY EVENT STRING")
    return null
}
