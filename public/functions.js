let allTeams = [];
let editId;

function getHtmlTeams(teams) {
    return teams.map(team => {
        return `<tr>
            <td>${team.members}</td>
            <td>${team.name}</td>
            <td>${team.url}</td>
            <td>
                <a href="#" class="remove-btn" data-id="${team.id}">&#10006;</a> 
                <a href="#" class="edit-btn" data-id="${team.id}">&#9998;</a>
            </td>
        </tr>`
    }).join("")
}

function showTeams(teams) {
    const html = getHtmlTeams(teams);
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = html;
}

function loadTeams() {
    fetch("http://localhost:3000/teams")
    .then(r => r.json())
    .then(teams => {
        allTeams = teams;
        showTeams(teams);
    });
}
loadTeams();

function addTeam(team) {
    fetch("teams/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(team)
    })
        .then(r => r.json())
        .then(status => {
            if (status.success) {
                window.location.reload();
            }
        });
} 

function updateTeam(team) {
    fetch("teams/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: editId,
            members: team.members,
            name: team.name,
            url: team.url
        })
    })
        .then(r => r.json())
        .then(status => {
            if (status.success) {
                window.location.reload();
            }
        });
} 

function saveTeam() {
    const members = document.querySelector("input[name = members]").value;
    const name = document.querySelector("input[name = name]").value;
    const url = document.querySelector("input[name = url]").value;

    const team = {
        name: name,
        members: members,
        url: url
    };
    
    if (editId) {
        team.id = editId;
        updateTeam(team);
    } else {
        addTeam(team);
    };
}

function removeTeam(id) {
    fetch("teams/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
    })
        .then(r => r.json())
        .then(status => {
            if (status.success) {
                loadTeams();            
            }
        });
}

document.querySelector("table tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
        const id = e.target.getAttribute('data-id');
        removeTeam(id);
    } else if (e.target.matches("a.edit-btn")) {
        document.getElementById('saveBtn').innerText = 'Update';

        const id = e.target.getAttribute('data-id');
        const editTeam = allTeams.find(team => team.id == id);
        setValues(editTeam);
        editId = id;
    }
});

document.getElementById('search').addEventListener('input', e => {
    const text = e.target.value.toLowerCase();
    const filtered = allTeams.filter(team => {
        return team.members.toLowerCase().indexOf(text) > -1;
    });
        showTeams(filtered);
})

function setValues(team) {
    document.querySelector("input[name = members]").value = team.members;
    document.querySelector("input[name = name]").value = team.name;
    document.querySelector("input[name = url]").value = team.url;
}