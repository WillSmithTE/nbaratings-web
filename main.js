const SCORE_EXPONENTIAL = 8;

// const HOST = 'http://localhost:5000';
const HOST = 'https://ratings-2k-be-tumozo4dqa-ts.a.run.app';

fetch(`${HOST}/api/team`)
    .then((response) => response.json())
    .then((response) => {
        const teamNames = Object.keys(response);
        teamNames.forEach((teamName) => response[teamName].winEfficiency = response[teamName].wins / response[teamName].expectedQuality19_20);
        teamNames.sort((a, b) => response[b].winEfficiency - response[a].winEfficiency);
        scaleValues(response, 'winEfficiency');
        scaleValues(response, 'expectedQuality19_20');
        scaleValues(response, 'rating2k');
        const table = document.getElementById('teamTable');
        const tableBody = table.getElementsByTagName('tbody')[0];
        for (teamName of teamNames) {
            const newRow = tableBody.insertRow(tableBody.rows.length);
            const teamCell = newRow.insertCell(0);
            const winEfficiencyCell = newRow.insertCell(1);
            const expectedQuality19_20 = newRow.insertCell(2);
            const winsCell = newRow.insertCell(3);
            const rating2kCell = newRow.insertCell(4);
            teamCell.appendChild(document.createTextNode(teamName));
            winEfficiencyCell.appendChild(document.createTextNode(response[teamName].winEfficiency));
            expectedQuality19_20.appendChild(document.createTextNode(response[teamName].expectedQuality19_20));
            winsCell.appendChild(document.createTextNode(response[teamName].wins));
            rating2kCell.appendChild(document.createTextNode(response[teamName].rating2k));
        }
        table.style.display = 'table';
        document.getElementById('loading').style.display = 'none';
    });

fetch(`${HOST}/api/player`)
    .then((response) => response.json())
    .then((response) => {
        const playerNames = Object.keys(response);
        playerNames.forEach((playerName) => {
            teamMinutesCurrentTeam = response[playerName].teamsMinutes.find(({ teamName }) => teamName === response[playerName].teamName);
            if (teamMinutesCurrentTeam !== undefined) {
                response[playerName].minutesPlayed = teamMinutesCurrentTeam.minutes;
            } else {
                response[playerName].minutesPlayed = 0;
            }
            response[playerName].value19_20 = (response[playerName].rating ** SCORE_EXPONENTIAL) * response[playerName].minutesPlayed;
        });
        playerNames.sort((a, b) => response[b].rating - response[a].rating);
        scaleValues(response, 'value19_20');
        const table = document.getElementById('playerTable');
        const tableBody = table.getElementsByTagName('tbody')[0];
        for (playerName of playerNames) {
            const newRow = tableBody.insertRow(tableBody.rows.length);
            const nameCell = newRow.insertCell(0);
            const ratingCell = newRow.insertCell(1);
            const teamCell = newRow.insertCell(2);
            const value19_20Cell = newRow.insertCell(3);
            const minutesCell = newRow.insertCell(4);
            nameCell.appendChild(document.createTextNode(formatName(playerName)));
            ratingCell.appendChild(document.createTextNode(response[playerName].rating));
            teamCell.appendChild(document.createTextNode(response[playerName].teamName));
            value19_20Cell.appendChild(document.createTextNode((response[playerName].value19_20)));
            minutesCell.appendChild(document.createTextNode(response[playerName].minutesPlayed));
        }
        table.style.display = 'table';
        document.getElementById('loading').style.display = 'none';
    });

function scaleValues(object, propertyName) {
    let
        max = Number.MAX_VALUE * -1,
        min = Number.MAX_VALUE;
    Object.keys(object).forEach((key) => {
        property = object[key][propertyName];
        if (property < min) {
            min = property;
        }
        if (property > max) {
            max = property;
        }
    });
    Object.keys(object).forEach((key) => {
        object[key][propertyName] = Math.round(10000 * (object[key][propertyName] - min) / (max - min)) / 100;
    });
}

function formatName(name) {
    return name
        .split(' ')
        .map((split) => split.charAt(0).toUpperCase() + split.slice(1))
        .join(' ');
}