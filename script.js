const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Replace 'YOUR-COHORT-NAME' with your actual cohort name
const cohortName = '2803-PUPPIES';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * Fetches all players from the API.
 * @returns {Array} Array of player objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

/**
 * Redirects to the player details page.
 * @param {number} playerId - ID of the player.
 */
const viewPlayerDetails = (playerId) => {
    window.location.href = `details.html?id=${playerId}`;
};

/**
 * Adds a new player to the roster.
 * @param {Object} playerObj - Player details.
 */
const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerObj),
        });

        if (!response.ok) throw new Error('Failed to add player.');

        init(); // Refresh player list
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

/**
 * Removes a player from the roster by ID.
 * @param {number} playerId - ID of the player.
 */
const removePlayer = async (playerId) => {
    try {
        await fetch(`${APIURL}/${playerId}`, { method: 'DELETE' });
        init(); // Refresh player list
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId}!`, err);
    }
};

/**
 * Renders all players on the page.
 * @param {Array} playerList - Array of player objects.
 */
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = ''; // Clear existing content

        playerList.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            playerCard.innerHTML = `
                <img src="${player.imageUrl}" alt="${player.name}">
                <h3>${player.name}</h3>
                <p>Breed: ${player.breed}</p>
                <button onclick="viewPlayerDetails(${player.id})">See Details</button>
                <button onclick="removePlayer(${player.id})">Remove</button>
            `;

            playerContainer.appendChild(playerCard);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

/**
 * Renders the new player form.
 */
const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
            <h2>Add a New Player</h2>
            <form id="addPlayerForm">
                <input type="text" id="playerName" placeholder="Player Name" required>
                <input type="text" id="playerBreed" placeholder="Breed" required>
                <input type="text" id="playerImage" placeholder="Image URL" required>
                <button type="submit">Add Player</button>
            </form>
        `;

        document.getElementById('addPlayerForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const newPlayer = {
                name: document.getElementById('playerName').value,
                breed: document.getElementById('playerBreed').value,
                imageUrl: document.getElementById('playerImage').value
            };
            await addNewPlayer(newPlayer);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

/**
 * Initializes the app by fetching and rendering players.
 */
const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};

init();
