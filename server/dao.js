'use strict';
/* Data Access Object (DAO) */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('guesswhodb.db', (err) => {
  if(err) throw err;
});

// This function retrieves the whole list of games from the database.
exports.listGames = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE user=? AND completed=1';
    db.all(sql, [user.id], (err, rows) => {
      if (err) {reject(err); return;}

      const games = rows.map((e) => {
        // WARNING: the database returns only lowercase fields. So, to be compliant with the client-side, we convert "date" to the camelCase version ("date").
        const game = Object.assign({}, e, { date: e.date } );  // adding camelcase "date"
       return game;
      });
      resolve(games);
    });
  });
};

// This function retrieves the list of objects from the database (by level).
exports.listObjects = (level) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM objects';
    db.all(sql, [], (err, rows) => {
      if (err) {reject(err); return;}
      const allObjects = rows.map((e) => ({ id: e.id, type: e.type, name: e.name, color: e.color, season: e.season, taste: e.taste, seeds: e.seeds, tree: e.tree, peel: e.peel, juice: e.juice, img: e.img }));
      
      // Meccanismo per selezionare un sottoinsieme random (oggetti consecutivi) tra gli oggetti in base al livello
      if(level == 'easy'){
        const startIndex = Math.floor(Math.random() * 24) + 1; //Indice casuale (massimo 24)
        if(startIndex>24)
          startIndex = 24; // per essere sicuri al 151%
        const objects = allObjects.slice(startIndex, startIndex+12);
        resolve(objects);
      }else if(level == 'medium'){
        const startIndex = Math.floor(Math.random() * 12) + 1; //Indice casuale (massimo 12)
        if(startIndex>12)
          startIndex = 12; // per essere sicuri due volte al 151%
        const objects = allObjects.slice(startIndex, startIndex+24);
        resolve(objects);
      }else if(level == 'hard'){
        resolve(allObjects);
      }else{
        reject('Error: level is not a valid level');
      }
    });
  });
};

// add a new game in games
exports.createNewGame= (game) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO games(user, date, score, secretObject, level, completed) VALUES(?, DATE(?), ?, ?, ?, ?)';
    db.run(sql, [game.user, game.date, game.score, game.secretObject, game.level, game.completed], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// Get secret object from games with gameid
exports.getSecret = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE id=?';
    db.all(sql, [gameId], (err, row) => {
      if (err) {reject(err); return;}
      if (row == undefined || row.length == 0) {
        resolve({error: 'Game not found.'});
      } else {
        const secret = { id: row[0].id, secretObject: row[0].secretObject };
        resolve(secret);
      }
    });
  });
};

// This function retrieves the list of all objects from the database.
exports.listAllObjects = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM objects';
    db.all(sql, [], (err, rows) => {
      if (err) {reject(err); return;}
      const allObjects = rows.map((e) => ({ id: e.id, type: e.type, name: e.name, color: e.color, season: e.season, taste: e.taste, seeds: e.seeds, tree: e.tree, peel: e.peel, juice: e.juice, img: e.img }));
        resolve(allObjects);
    });
  });
};

// update the game identified by gameId and userid with score and set completed
exports.saveGame = (gameId, userId, score) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET score=?, completed=? WHERE id = ? AND user = ?';  // Double check: per essere sicuri di non salvare games non autenticati
    // It is NECESSARY to check that the answer belongs to the userId
    db.run(sql, [score, 1, gameId, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes); // return the number of affected rows
    });
  });
};

// delete the game with gameId
exports.deleteGame = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM games WHERE id = ? AND user = null'; 
    db.run(sql, [gameId], function (err) {
      if (err) {
        reject(err);
        return;
      } else
        resolve(this.changes);  // return the number of affected rows
    });
  });
};