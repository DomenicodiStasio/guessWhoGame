/**
 * All the API calls
 */

import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';

/*
async function getAllQuestions() {
  // call  /api/questions
  const response = await fetch(URL+'/questions');
  const questions = await response.json();
  if (response.ok) {
    return questions.map((e) => ({id: e.id, text:e.text, author:e.author, date: dayjs(e.date)}) )
  } else {
    throw questions;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getQuestion(id) {
    // call  /api/questions/<id>
    const response = await fetch(URL+`/questions/${id}`);
    const question = await response.json();
    if (response.ok) {
      const e = question;
      return {id: e.id, text: e.text, author: e.author, date: dayjs(e.date)};
    } else {
      throw question;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

async function getAnswersByQuestionId(id) {
    // call  /api/questions/<id>/answers
    const response = await fetch(URL+`/questions/${id}/answers`);
    const answers = await response.json();
    if (response.ok) {
      return answers.map((e) => ({id: e.id, text: e.text, respondent: e.respondent, score: e.score, 
        date: dayjs(e.date), questionId: e.questionId, respondentId: e.respondentId}) );
    } else {
      throw answers;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }


function voteAnswer(id) {
  // call  POST /api/answers/<id>/vote
  return new Promise((resolve, reject) => {
    fetch(URL+`/answers/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vote: 'upvote' }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function addAnswer(answer) {
  // call  POST /api/answers
  return new Promise((resolve, reject) => {
    fetch(URL+`/answers`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, answer, {date: answer.date.format("YYYY-MM-DD")})),
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((id) => resolve(id))
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function deleteAnswer(id) {
  // call  DELETE /api/answers/<id>
  return new Promise((resolve, reject) => {
    fetch(URL+`/answers/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateAnswer(answer) {
  // call  PUT /api/answers/<id>
  return new Promise((resolve, reject) => {
    fetch(URL+`/answers/${answer.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, answer, {date: answer.date.format("YYYY-MM-DD")})),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}
*/

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

async function getUserInfo() {
  const response = await fetch(URL+'/sessions/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}


async function getGames() {
  // call  /api/games
  const response = await fetch(URL+'/games', { credentials: 'include' });
  const games = await response.json();

  if (response.ok) {
    return games.map((e) => ({id: e.id, level: e.level, score: e.score, secretObject: e.secretObject, 
      date: dayjs(e.date).format('DD-MM-YYYY')}) );
  } else {
    throw games;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}
/*
// VECCHIA VERSIONE - FUNZIONANTE MA CON ERRORI GRAVI SULLE API HTTP
async function getObjects(level) {
  // call  /api/play/<level>
  const response = await fetch(URL+`/play/${level}`,  { credentials: 'include' });
  let objects = await response.json();

  if (response.ok) {
    const gameId = objects[0];
    objects.shift();
    const objectsMapped = objects.map((e) => ({id: e.id, name: e.name, type: e.type, color: e.color, season: e.season, taste: e.taste, seeds: e.seeds, tree: e.tree, peel: e.peel, juice: e.juice, img: e.img}) );
    objectsMapped.unshift(gameId);
    return objectsMapped;
  } else {
    throw objects;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}*/

async function getObjects2(level) {
  // call  GET /api/fruits/<level> and POST /api/games
  return new Promise((resolve, reject) => {
    fetch(URL+`/fruits/${level}`)
    .then((response) => {
      if (response.ok) {
        response.json()
          .then(async(objects) => {
            const objectsMapped = objects.map((e) => ({id: e.id, name: e.name, type: e.type, color: e.color, season: e.season, taste: e.taste, seeds: e.seeds, tree: e.tree, peel: e.peel, juice: e.juice, img: e.img}) );
      
            const bodyObject = {
              level: level,
              objects: objectsMapped
            }
            let response2 = await fetch(URL+'/games', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyObject),
            });
            if (response2.ok) {
              const gameId = await response2.json();
              objectsMapped.unshift(gameId);
              resolve(objectsMapped)
            } else {
              const errDetail = await response2.json();
              throw errDetail.message;
            }
          })
          .catch(() => { 
            reject({ error: "Cannot parse server response." }) ;
          }); // something else
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function getHint(gameId, property, value) {
  // call  /api/attempts/<gameId>/<property>/<value>
  let checkedValue = value;
  if(value == 'seedsyes' || value == 'fromtree' || value == 'hasjuice'){
    checkedValue = 1;
  }else if(value == 'noseeds' || value == 'notfromtree' || value == 'nojuice'){
    checkedValue = 0;
  }

  const response = await fetch(URL+`/attempts/${gameId}/${property}/${checkedValue}`);
  const hint = await response.json();

  if (response.ok) {
    return hint;
  } else {
    throw hint;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}
/*
async function endGame(gameId, score, selectedObject) {
  // call  /api/end/<gameId>
  const response = await fetch(URL+`/end/${gameId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({gameId: gameId, score: score, selectedObject: selectedObject}),
  });
  const ret = await response.json();
    if(response.ok){
      return ret;
    }else{
      throw response;
    }
}*/

async function endGame2(gameId, score, selectedObject) {
  // call  GET /api/secrets/<gameId> and PUT /api/games

  return new Promise((resolve, reject) => {
    fetch(URL+`/secrets/${gameId}`)
    .then((response) => {
      if (response.ok) {
        response.json()
          .then(async(secretObject) => {
            const response3 = await fetch(URL+'/games', {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({gameId: gameId, score: score, secretObject: secretObject.secretObject, selectedObject: selectedObject}),
            });
            const ret = await response3.json();
            // Qui ret contiene il numero di righe aggiornate
            // Effettuo un controllo su due condizioni praticamente impossibili, per completezza
            if(ret<0 || ret>1){
              reject({ error: "Severe errors on database updating." }) ;
            }

              if(response3.ok){
                resolve(secretObject)
              }else{
                throw ret;
              }
          })
          .catch(() => { 
            reject({ error: "Cannot parse server response." }) ; // something else
          });
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}



const API = {
  getGames, getObjects2, getHint, endGame2,
  logIn, logOut, getUserInfo
};
export default API;