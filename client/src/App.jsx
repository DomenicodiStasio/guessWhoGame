import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import DefaultRoute from './components/DefaultRoute.jsx';
//import { Col, Container, Row, Button, Form, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
//import dayjs from 'dayjs';
import History from './components/History.jsx';
import GameComponent from "./components/GameComponents";
import NavHeader from './components/NavbarComponents.jsx';
import { LoginForm } from './components/AuthComponents';
import API from './API';
import 'bootstrap/dist/css/bootstrap.min.css';
import MessageContext from './messageCtx';

function App() {

  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [games, setGames] = useState([]);
  const [dirty, setDirty] = useState(false);
  //const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [gameId, setGameId] = useState();
  const [endGameInvisibility, setEndGameInvisibility] = useState(false);
  const [startGameDisabled, setStartGameDisabled] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // errors debug function
  function handleErrors(err) {
    console.log('err: '+JSON.stringify(err));  // Only for debug
    let errMsg = 'Unkwnown error';
    if (err.errors) {
      if (err.errors[0])
        if (err.errors[0].msg)
          errMsg = err.errors[0].msg;
    } else if (err.error) {
      errMsg = err.error;
    }
    setTimeout(()=>setDirty(true), 1000);  // Fetch correct version from server, after a while
  }

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);

  
  useEffect(() => {
    if (dirty) {
      setInitialLoading(true);
      API.getGames()
        .then(games => {
          setGames(games);
          setInitialLoading(false);
          setDirty(false);
        })
        .catch(e => { 
          handleErrors(e); //setDirty(false); 
        } ); 
    }
  }, [dirty]);

  const doSetDirty = async (value) => {
    if(value === true || value === false)
    setDirty(value);
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    setGameId(undefined);
    setEndGameInvisibility(true);
    setStartGameDisabled(false);
    /* set state to empty if appropriate */
  }
  

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setGameId(undefined);
    setEndGameInvisibility(true);
    setStartGameDisabled(false);
    //setDirty(true);  // load latest version of data, if appropriate
  }

  const loginCancelled = () => {
    setGameId(undefined);
    setEndGameInvisibility(true);
    setStartGameDisabled(false);
    //setDirty(true);  // load latest version of data, if appropriate
  }

  return (
    <>
    <BrowserRouter>
    <MessageContext.Provider value={{ handleErrors }}>
      <Routes>
        {/*<Route path='/' element={ <AnswerRoute user={user} logout={doLogOut}/> } />*/}
        <Route path='/' element={ <><NavHeader user={user} logout={doLogOut} setInitialLoading={setInitialLoading} doSetDirty={doSetDirty} setGameId={setGameId} setEndGameInvisibility={setEndGameInvisibility} setStartGameDisabled={setStartGameDisabled}/><GameComponent errors={errors} setErrors={setErrors} setGameId={setGameId} gameId={gameId} setStartGameDisabled={setStartGameDisabled} startGameDisabled={startGameDisabled} setEndGameInvisibility={setEndGameInvisibility} endGameInvisibility={endGameInvisibility} initialLoading={initialLoading} setInitialLoading={setInitialLoading}/></>}/>
        <Route path='/history' element={loggedIn? <><NavHeader user={user} logout={doLogOut} setInitialLoading={setInitialLoading} doSetDirty={doSetDirty} setGameId={setGameId} setEndGameInvisibility={setEndGameInvisibility} setStartGameDisabled={setStartGameDisabled}/><History initialLoading={initialLoading} setInitialLoading={setInitialLoading} games={games} dirty={dirty}/></>:  <Navigate replace to='/' />} />
        <Route path='/login' element={loggedIn? <Navigate replace to='/' />:  <LoginForm loginSuccessful={loginSuccessful} loginCancelled={loginCancelled}/>} />
        <Route path='/*' element={<DefaultRoute />} />
      </Routes>
      </MessageContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App