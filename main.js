const SCORE_EXPONENTIAL = 8;

fetch('http://localhost:5000/api/2k/total')
    .then((response) => response.json())
    .then((response) => {
        const teamNames = Object.keys(response);
        teamNames.sort((a, b) => response[b] - response[a]);
        const table = document.getElementById('totalsTable');
        const tableBody = table.getElementsByTagName('tbody')[0];
        for (teamName of teamNames) {
            const newRow = tableBody.insertRow(tableBody.rows.length);
            const teamCell = newRow.insertCell(0);
            const scoreCell = newRow.insertCell(1);
            teamCell.appendChild(document.createTextNode(teamName));
            scoreCell.appendChild(document.createTextNode(Math.pow(response[teamName], SCORE_EXPONENTIAL)));
        }
        table.style.display = 'table';
        document.getElementById('loading').style.display = 'none';
    });