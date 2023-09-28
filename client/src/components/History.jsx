import NavHeader from "./NavbarComponents";
import {Container, Spinner} from 'react-bootstrap';
import GameHistoryItem from './GameHistoryItem.jsx';
import API from "../API";
import { useState, useEffect, useContext } from 'react';
import MessageContext from '../messageCtx';

function History(props) {
    const history = props.games;
    const dirty = props.dirty;
    const {handleErrors} = useContext(MessageContext);
      

      const totalScore = history.reduce((total, game) => total + game.score, 0);

    return (
        <>
            <Container fluid="md">
                <div>
                    <h2 className="mt-3">Your game history</h2>
                    {props.initialLoading ?  <Container className="m-3 d-flex justify-content-center"><Spinner className="m-2" animation="border" role="status"/></Container> : <>
                    <GameHistoryItem games={history}/>
                    <p>Punteggio Totale: {totalScore}</p> </>}
                </div>
            </Container>        
        </>            
    );
}

export default History;