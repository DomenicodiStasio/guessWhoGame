import React, { useState, useContext } from 'react';
import {Container, Table, Row, Col, Button, Image} from 'react-bootstrap';
import MessageContext from '../messageCtx';
import API from '../API'; 

function EndComponent(props) {
    const numTry = props.numTry;
    const setStartGameDisabled = props.setStartGameDisabled;
    const secretObject = props.secretObject;
    const setSecretObject = props.setSecretObject;
    const setEndGameInvisibility = props.setEndGameInvisibility;
    const endGameInvisibility = props.endGameInvisibility;
    const setTryDisabled = props.setTryDisabled;
    const showAlert = props.showAlert;
    const [score, setScore] = useState(0);
    const [result, setResult] = useState('');
    //const [effectEndGame, setEffectEndGame] = useState(1);

    const {handleErrors} = useContext(MessageContext);
    
    const handleConfirmClick = async() => {
        let scoreCalculated = props.objects.length - numTry;
        // CHECK LOGICO: nel caso in cui venga fuori uno score negativo, viene azzerato
        if(scoreCalculated<0){
            scoreCalculated=0;
        }
        await API.endGame2(props.gameId, scoreCalculated, props.selectedObject)
        .then(secretObjectResponse => {

            let objectRevealed;
            for(const obj of props.objects){
                if(obj.name == secretObjectResponse.secretObject){
                    objectRevealed = obj;
                }
            }
            //setDropdownDisabled(false);
            setSecretObject(objectRevealed);

            if (props.selectedObject.name === secretObjectResponse.secretObject) {
                setResult('Win! 🎉');
                setScore(scoreCalculated);
            } else {
                setResult('Lose! 😭');
                setScore(0);
            }
            setStartGameDisabled(false);
            setEndGameInvisibility(true);
            setTryDisabled(true);
        })
        .catch(e => { 
        showAlert('Error: ', 'error trying to end game: '+e.error, 'warning');
        });
    };

    return (
        <Container className="p-3 d-flex justify-content-center">
        <table className="border">
            <tbody>
                <tr>
                    <td>Choosen:</td>
                    <td>Secret:</td>
                </tr>
                <tr>
                    <td>
                        {
                            props.selectedObject.id ? <Image key={props.selectedObject.id} width={100} height={100} src={'http://localhost:3001/' + props.selectedObject.img} rounded fluid/> : <img src='https://via.placeholder.com/100' alt="Random" />
                        }
                        </td>
                    <td>
                        {
                            secretObject.id ? <Image key={secretObject.id} width={100} height={100} src={'http://localhost:3001/' + secretObject.img} rounded fluid/> : <img src='https://via.placeholder.com/100' alt="Random" />
                        }
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">
                        {(endGameInvisibility || !props.selectedObject.id) ? null : <Button className="align-center mx-1" onClick={handleConfirmClick}>Confirm and finish game</Button>}
                    </td>
                </tr>
                <tr>
                    <td>Result: {result}</td>
                    <td>Score: {score}</td>
                </tr>
            </tbody>
        </table>
        </Container>
    );
}

export default EndComponent;
