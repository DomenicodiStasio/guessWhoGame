'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult, param} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');
const dayjs = require('dayjs');

// init express
const app = express();
const port = 3001;
// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti
app.use(express.static('public'))
const answerDelay = 100;

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'abc8d239abc93rkskb',   //personalize this random string, should be a secret value
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'Not authenticated'});
}


/*** APIs ***/

// GET /api/games
// 1. Retrieve the list of all games of authenticated user (the history).
// This route returns the Games List
app.get('/api/games', isLoggedIn, async (req, res) => {
  try{
    const games = await dao.listGames(req.user);
    setTimeout(()=>res.status(200).json(games), answerDelay); // 200 Success - OK
  }catch(err){
    res.status(500).end();  // 500 Internal Server Error
  }
  }
);

// GET /api/fruits/<level>
// 1. Retrieve the list of fruits of the game (by level).
// This route returns the Objects List
app.get('/api/fruits/:level', [
  param('level').exists().isString().isIn(['easy', 'medium', 'hard']).withMessage('Level does contain invalid value')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()}); // 422 Unprocessable Entity
  }
  try{
    const objects = await dao.listObjects(req.params.level);
    if(objects.error)
      res.status(400).json(objects); // 400 Bad Request
    else
    setTimeout(()=>res.status(200).json(objects), answerDelay); // 200 Success - OK
  }catch(err){
    res.status(500).end(); // 500 Internal Server Error
  }
  }
);

// POST /api/games
// 1. Create a new game. Nel body passo level, objects (fruits)
// This route returns the gameId of the game created
app.post('/api/games', [
  check('level').isString().isIn(['easy', 'medium', 'hard']).withMessage('Level does contain invalid value'),
  check('objects').isArray().withMessage('Objects is not exprected type (Array of objects - JSON)') 
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()}); // 422 Unprocessable Entity
  }
  // Ricavo l'oggetto segreto tra gli oggetti che ricevo
  const minIndex = 0;
  const maxIndex = req.body.level == 'easy' ? 11 :
              req.body.level == 'medium' ? 23 :
              req.body.level == 'hard' ? 35 :
              -999;
  const randomIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
  const secretObj = req.body.objects[randomIndex].name;
  // Per discernere nuovi games autenticati da quelli non autenticati
  const user = req.isAuthenticated() ? req.user.id : null;
  // Creazione dell'oggetto "game"
  const game = {
    user: user,
    date: dayjs().format('YYYY-MM-DD'),
    score: 0,
    secretObject: secretObj,
    level: req.body.level, 
    completed: 0  
  };

  try {
    const gameId = await dao.createNewGame(game);
    res.status(201).json({gameId: gameId}); // 201 Success - Created
  } catch (err) {
    res.status(503).json({ error: 'Database error during the creation of new game.' }); // 503 Service Unavailable
    return;
  }
  }
);

// GET /api/attempts/<gameId>/<property>/<value>
// 1. Get the hint for secret object.
// This route returns yes/no
app.get('/api/attempts/:gameId/:property/:value', [
  param('gameId').exists().toInt().isInt().withMessage('GameId param is not valid'), 
  // In questa fase mi basta controllare che esista e che sia un identificativo intero. Se l'id è
  // inesistente, lo comunicherà la dao.getSecret (if row==undefined)
  param('property').exists().isString().isIn(['type', 'color', 'season', 'taste', 'seeds', 'tree', 'peel', 'juice']).withMessage('Property does contain invalid value'),
  param('value').exists().withMessage('Property value does not exists')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()}); // 422 Unprocessable Entity
  }
  if(!((req.params.property == 'type' && (req.params.value == 'frutta' || req.params.value == 'verdura')) ||
      (req.params.property == 'season' && (req.params.value == 'estate' || req.params.value == 'inverno')) ||
      (req.params.property == 'seeds' && (req.params.value == 1 || req.params.value == 0)) ||
      (req.params.property == 'tree' && (req.params.value == 1 || req.params.value == 0)) ||
      (req.params.property == 'juice' && (req.params.value == 1 || req.params.value == 0)) ||
      (req.params.property == 'taste' && (req.params.value == 'dolce' || req.params.value == 'amaro' || req.params.value == 'neutro')) ||
      (req.params.property == 'peel' && (req.params.value == 'liscia' || req.params.value == 'pelosa' || req.params.value == 'assente' || req.params.value == 'ruvida')) ||
      (req.params.property == 'color' && (req.params.value == 'arancione' || req.params.value == 'rossa' || req.params.value == 'verde' || req.params.value == 'giallo' || req.params.value == 'viola' || req.params.value == 'bianco' || req.params.value == 'rosa'))
  )){
    return res.status(400).json(); // 400 Bad request
  }

  let secret;
  try{
    secret = await dao.getSecret(req.params.gameId);
    if(secret.error)
      res.status(404).json(secret); // 404 Not found
    //else
      //setTimeout(()=>res.status(201).json(secret), answerDelay);
  }catch(err){
    res.status(500).end();
  }

  let allObjects;
  try {
    allObjects = await dao.listAllObjects();
  } catch (err) {
    res.status(503).json({ error: 'Database error getting all objects.' });
    return;
  }

  let secretObjectProperties = allObjects.find(object => object.name == secret.secretObject);

  const propertyObserved = req.params.property;
  const propertyMatch = secretObjectProperties[propertyObserved] == req.params.value ? true : false;

  if(propertyMatch === true){
    res.status(201).json({hint: 'yes'});
  }else if(propertyMatch === false){
    res.status(201).json({hint: 'no'});
  }else{
    res.status(500).json({ error: 'Error in property matching.' });
  }
});

// GET /api/secrets/<gameId>
app.get('/api/secrets/:gameId', [
  param('gameId').exists().toInt().isInt().withMessage('GameId param is not valid') 
  // In questa fase mi basta controllare che esista e che sia un identificativo intero. Se l'id è
  // inesistente, lo comunicherà la dao.getSecret (if row==undefined)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()}); // 422 Unprocessable Entity
  }

  try {
    const result = await dao.getSecret(req.params.gameId);
    if(result.error)
      res.status(404).json(result);     // 404 Not Found
    else
      res.status(200).json(result);  // 200 Success - OK
  } catch(err) {
    res.status(500).end(); // 500 Internal Server Error
  }
});

// PUT /api/games
// 1. if logged, save the game in history, else do nothing.
// Qui ho pensato che avrei potuto implementare una res.redirect() ad una DELETE /api/games
// per eliminare il game non autenticato. Tuttavia ci sarebbe comunque bisogno di implementare
// un metodo per la pulizia del database di tutti i game non autenticati che non hanno terminato
// la sessione di gioco.
// Return num row changes
app.put('/api/games', [
  check('gameId').isInt().withMessage('GameId param is not valid') ,
  check('score').isInt({ min: 0, max: 36 }).withMessage('Score does contain invalid value'),
  check('secretObject').isObject().withMessage('Secret object does contain invalid value')
], async (req, res) => {
    //Salvataggio game autenticato
    if(req.isAuthenticated()){
    try {
      let numRowChanges;
      if(req.body.secretObject == req.body.selectedObject.name){
        numRowChanges = await dao.saveGame(req.body.gameId, req.user.id, req.body.score); 
      }else{
        numRowChanges = await dao.saveGame(req.body.gameId, req.user.id, 0);
      }
      
    // number of changed rows is sent to client as an indicator of success
      res.status(200).json(numRowChanges); // 200 Success - OK
    } catch (err) {
      res.status(503).json({error: `Database error during the saving of game: ${req.body.gameId}.`}); // 503 Service Unavailable
    }
  }else{
    res.status(200).json(0); // 200 Success - OK
    //res.status(200).end();
  }
}
);

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});
});

/*** Other express-related instructions ***/
// Activate the server
app.listen(port, () => {
  console.log(`guessWho-server listening at http://localhost:${port}`);
});
