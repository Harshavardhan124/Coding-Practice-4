const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

module.exports = app;

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// 1st API
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

// 2nd API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayersQuery = `
    INSERT INTO cricket_team
    (player_name, jersey_number, role)
    VALUES (
        "${playerName}",
        ${jerseyNumber},
        "${role}"
    );`;

  await db.run(addPlayersQuery);
  response.send("Player Added to Team");
});

// 3rd API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};`;
  const dbResponse = await db.get(getPlayerQuery);
  response.send(dbResponse);
});

// 4th API
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  const updatePlayerQuery = `
    UPDATE cricket_team
    SET
    player_name = "${playerName}",
    jersey_number = ${jerseyNumber},
    role = "${role}"
    WHERE player_id = ${playerId};`;

  const dbResponse = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//5th API
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
    cricket_team
    WHERE player_id = ${playerId};`;

  const dbResponse = await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
