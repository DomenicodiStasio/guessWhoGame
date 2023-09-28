import React, { useState, useEffect, useContext } from 'react';
import {Button, ButtonGroup, Dropdown, Table, Container, Row, Col, Image as BootstrapImage, Spinner} from 'react-bootstrap';
import API from '../API';
import '../App.css'; 
import MessageContext from '../messageCtx';
import EndComponent from './EndComponents';
import TryComponent from './TryComponents';

  function GameComponent(props){
    const [level, setLevel] = useState('');
    const [objects, setObjects] = useState([]);
    const [table, setTable] = useState();
    const [startIndex, setStartIndex] = useState(0);
    const [selectedObject, setSelectedObject] = useState({});
    const [imageStyler, setImageStyler] = useState([]);
    const [disabledCount, setDisabledCount] = useState(0);
    const [tryDisabled, setTryDisabled] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [numTry, setNumTry] = useState(0);
    const [secretObject, setSecretObject] = useState('');
    const {handleErrors} = useContext(MessageContext);

    const setErrors = props.setErrors;
    const errors = props.errors;
    const setGameId = props.setGameId;
    const gameId = props.gameId;
    const setEndGameInvisibility = props.setEndGameInvisibility;
    const endGameInvisibility = props.endGameInvisibility;
    const setStartGameDisabled = props.setStartGameDisabled;
    const startGameDisabled = props.startGameDisabled;

    const[propertyState, setPropertyState] = useState(
        {
        type: {
            property: true,
            frutta: true,
            verdura: true
        },
        color: {
            property: true,
            arancione: true,
            rossa: true,
            verde: true,
            giallo: true,
            viola: true,
            bianco: true,
            rosa: true
        },
        season: {
            property: true,
            estate: true,
            inverno: true
        },
        taste: {
            property: true,
            dolce: true,
            amaro: true,
            neutro: true
        },
        seeds: {
            property: true,
            seedsyes: true,
            noseeds: true
        },
        tree: {
            property: true,
            fromtree: true,
            notfromtree: true
        },
        peel: {
            property: true,
            ruvida: true,
            liscia: true,
            pelosa: true,
            assente: true
        },
        juice: {
            property: true,
            hasjuice: true,
            nojuice: true
        }
        }
    );

    const showAlert = (title, message, variant) => {
        const newAlert = { title, message, variant };
        setAlerts([...alerts, newAlert]);
      };
    const dismissAlert = (index) => {
        const updatedAlerts = [...alerts];
        updatedAlerts.splice(index, 1);
        setAlerts(updatedAlerts);
      };

      const showError = (title, message, variant, dismissMessage) => {
        const newAlert = { title, message, variant, dismissMessage };
        setErrors([...errors, newAlert]);
      };
    const dismissError = (index) => {
        const updatedAlerts = [...errors];
        updatedAlerts.splice(index, 1);
        setErrors(updatedAlerts);
      };

// evitabile
    useEffect(() => {
        if(disabledCount+1 == objects.length){
            setTryDisabled(true);
        }
      }, [disabledCount]);

    let elementsNumber = 0;
    let tableRows = 0;
  
    const handleStartGame = async() => {
        let apiFailed = false;
        if(level == 'easy' || level =='medium' || level =='hard'){
            props.setInitialLoading(true);
            await API.getObjects2(level)
                .then(resultObjects => {
                    const gameId = resultObjects[0].gameId;
                    resultObjects.shift();
                    setGameId(gameId);
                    setObjects(resultObjects);
                    // 123
                    //const startId = resultObjects[0].id;
                    //setStartIndex(startId);
                    props.setInitialLoading(false);
              })
              .catch(e => {             
                apiFailed = true;
                if(e.error == 'Cannot communicate with the server.')
                    showError('Server error:', e.error , 'danger', 'Ok, I\'ll go study web application')
                else
                    showError('Error:', e.error , 'danger', 'Ok, I\'ll go study web application')

                props.setInitialLoading(false);
                return;                
              } 
              ); 
        }else{
            showError('Error:', 'Can\'t start a game before selecting a level', 'warning', 'Ok, I\'ll make a decision');
            return;
        }
        if(apiFailed){
            return;
        }
        setNumTry(0);
        setSecretObject('');
        setEndGameInvisibility(false);
        setStartGameDisabled(true);
        setAlerts([]);
        setErrors([]);
        setTryDisabled(false);
        setImageStyler([]);
        setDisabledCount(0);
        setSelectedObject({});
        setStartIndex(0);
        setPropertyState(
            {
                type: {
                    property: true,
                    frutta: true,
                    verdura: true
                },
                color: {
                    property: true,
                    arancione: true,
                    rossa: true,
                    verde: true,
                    giallo: true,
                    viola: true,
                    bianco: true,
                    rosa: true
                },
                season: {
                    property: true,
                    estate: true,
                    inverno: true
                },
                taste: {
                    property: true,
                    dolce: true,
                    amaro: true,
                    neutro: true
                },
                seeds: {
                    property: true,
                    seedsyes: true,
                    noseeds: true
                },
                tree: {
                    property: true,
                    fromtree: true,
                    notfromtree: true
                },
                peel: {
                    property: true,
                    ruvida: true,
                    liscia: true,
                    pelosa: true,
                    assente: true
                },
                juice: {
                    property: true,
                    hasjuice: true,
                    nojuice: true
                }
                }
        );
    };

   // Per settare l'indice di partenza
    useEffect(() => {
            if(level == 'easy')
            tableRows = 2;
            else if(level == 'medium')
            tableRows = 4;
            else if(level == 'hard')
            tableRows = 6;
            else
            tableRows = 0;
      
        if (objects.length > 0){
            // 123
            const startId = objects[0].id;
            setStartIndex(startId);
        }
      }, [objects]);

      function handleObjectClick (object) {
        setSelectedObject(object);
      }
      
      // Per la disabilitazione delle immagini
      useEffect(() => {
        let disabledInternalCount = 0;
        for(const obj of objects){
            if(imageStyler[obj.id] == 'disabled-image'){
                disabledInternalCount++;
            }
        }
          setDisabledCount(disabledInternalCount);
      }, [imageStyler]);

      const handleDisableImages = async(pResult, pProperty, pValue, pObjects) => {
        if(pValue == 'seedsyes' || pValue == 'fromtree' || pValue == 'hasjuice'){
            pValue = 1;
          }else if(pValue == 'noseeds' || pValue == 'notfromtree' || pValue == 'nojuice'){
            pValue = 0;
          }
       
        let disabledInternalCount = 0;
        const updatedStyles = pObjects.map((object) => {
            if (pResult == 1 && object[pProperty] != pValue) {
                return 'disabled-image';
              } else if (pResult == 1 && object[pProperty] != pValue) {
              return 'disabled-image';
            } else if (pResult == 0 && object[pProperty] == pValue) {
              return 'disabled-image';
            } else {
              return imageStyler[object.id];
            }
          });
          
          const emptyArray = [];
          for (let i = 0; i < startIndex; i++) {
            emptyArray.push(''); 
          }
          const finalArray = emptyArray.concat(updatedStyles);
          setImageStyler(finalArray);
                  
      };

    return (
        <div>
            <>
            <Container className="mt-3 d-flex justify-content-center">
            {errors.map((error, index) => (
                    <div key={index} className={`alert mx-1 alert-${error.variant}`} role="alert">
                        <strong>{error.title}</strong> {error.message}
                        <Row>
                            <Col>
                            <Container className="mt-1 d-flex justify-content-center">
                                <ButtonGroup className="d-flex mt-2">
                        <Button className="d-flex" variant={error.variant} onClick={() => dismissError(index)}>{error.dismissMessage}</Button>
                                </ButtonGroup>
                                </Container>
                            </Col>
                        </Row>
                    </div>
                ))}
            </Container>
            <h3 className="text-center mt-1">Game</h3>
        <Container className="mt-3 d-flex justify-content-center">
            <h5 className="text-center mt-2 mx-2"> Choose level: </h5>
            
            <Dropdown onSelect={(selectedLevel) => {
                setLevel(selectedLevel);
                }}>
                <Dropdown.Toggle disabled={startGameDisabled} variant="primary" id="property-dropdown">
                    {level || 'Choose level'}
                </Dropdown.Toggle>
  
                <Dropdown.Menu>
                    <Dropdown.Item eventKey="easy">easy</Dropdown.Item>
                    <Dropdown.Item eventKey="medium">medium</Dropdown.Item>
                    <Dropdown.Item eventKey="hard">hard</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
  
            <div>
                <Button disabled={startGameDisabled} className="mx-2" variant="success" onClick={handleStartGame}>Play</Button>
            </div>
        </Container>

        <Container className="mt-4 d-flex justify-content-center">
        <div>
                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : null}
            </div>
            { endGameInvisibility ? null :
        <div className="table-responsive">
        <Table bordered>
          <tbody>
            <tr key={1}>
            {objects.map(
            (singleObject)=>{
                if(singleObject.id < startIndex+6)
                    return(
                            <td key={singleObject.id}>
                                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : <BootstrapImage className={imageStyler[singleObject.id]} key={singleObject.id} width={50} height={50} src={'http://localhost:3001/' + singleObject.img} rounded  style={selectedObject.id === singleObject.id ? { border: '3px solid red' } : {}} fluid onClick={()=>handleObjectClick(singleObject)}/>}
                            </td> 
                    )
            }
            )}
            </tr>
            <tr key={2}>
            {objects.map(
            (singleObject)=>{
                if(singleObject.id >= startIndex+6 && singleObject.id < startIndex+12)
                    return(
                            <td key={singleObject.id}>
                                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : <BootstrapImage className={imageStyler[singleObject.id]} key={singleObject.id} width={50} height={50} src={'http://localhost:3001/' + singleObject.img} rounded  style={selectedObject.id === singleObject.id ? { border: '3px solid red' } : {}} fluid onClick={()=>handleObjectClick(singleObject)}/>}
                            </td> 
                    )
            }
            )}
            </tr>
            <tr key={3}>
            {objects.map(
            (singleObject)=>{
                if(singleObject.id >= startIndex+12 && singleObject.id < startIndex+18)
                    return(
                            <td key={singleObject.id}>
                                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : <BootstrapImage className={imageStyler[singleObject.id]} key={singleObject.id} width={50} height={50} src={'http://localhost:3001/' + singleObject.img} rounded  style={selectedObject.id === singleObject.id ? { border: '3px solid red' } : {}} fluid onClick={()=>handleObjectClick(singleObject)}/>}
                            </td> 
                    )
            }
            )}
            </tr>
            <tr key={4}>
            {objects.map(
            (singleObject)=>{
                if(singleObject.id >= startIndex+18 && singleObject.id < startIndex+24)
                    return(
                            <td key={singleObject.id}>
                                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : <BootstrapImage className={imageStyler[singleObject.id]} key={singleObject.id} width={50} height={50} src={'http://localhost:3001/' + singleObject.img} rounded  style={selectedObject.id === singleObject.id ? { border: '3px solid red' } : {}} fluid onClick={()=>handleObjectClick(singleObject)}/>}
                            </td> 
                    )
            }
            )}
            </tr>
            <tr key={5}>
            {objects.map(
            (singleObject)=>{
                if(singleObject.id >= startIndex+24 && singleObject.id < startIndex+30)
                    return(
                            <td key={singleObject.id}>
                                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : <BootstrapImage className={imageStyler[singleObject.id]} key={singleObject.id} width={50} height={50} src={'http://localhost:3001/' + singleObject.img} rounded  style={selectedObject.id === singleObject.id ? { border: '3px solid red' } : {}} fluid onClick={()=>handleObjectClick(singleObject)}/>}
                            </td> 
                    )
            }
            )}
            </tr>
            <tr key={6}>
            {objects.map(
            (singleObject)=>{
                if(singleObject.id >= startIndex+30 && singleObject.id < startIndex+36)
                    return(
                            <td key={singleObject.id}>
                                {props.initialLoading ? <Spinner className="m-2" animation="border" role="status"/> : <BootstrapImage className={imageStyler[singleObject.id]} key={singleObject.id} width={50} height={50} src={'http://localhost:3001/' + singleObject.img} rounded  style={selectedObject.id === singleObject.id ? { border: '3px solid red' } : {}} fluid onClick={()=>handleObjectClick(singleObject)}/>}
                            </td> 
                    )
            }
            )}
            </tr>
          </tbody>
        </Table>
        </div>
  }
        </Container>
        {(gameId && !tryDisabled)? <><TryComponent objects={objects} gameId={gameId} alerts={alerts} showAlert={showAlert} dismissAlert={dismissAlert} setSelectedObject={setSelectedObject} setNumTry={setNumTry} numTry={numTry} handleDisableImages={handleDisableImages} setPropertyState={setPropertyState} propertyState={propertyState} tryDisabled={tryDisabled}/></> : null}
        {gameId ? <><EndComponent objects={objects} gameId={gameId} setTryDisabled={setTryDisabled} selectedObject={selectedObject} numTry={numTry} setStartGameDisabled={setStartGameDisabled} endGameInvisibility={endGameInvisibility} setEndGameInvisibility={setEndGameInvisibility} secretObject={secretObject} setSecretObject={setSecretObject} alerts={alerts} showAlert={showAlert}/></> : null}
        </>
        </div>
    );
  }
  
  export default GameComponent; 

/*
  function GameComponent() {
    return (
        <>
        <PlayLevelPicker />

        <div className="table-responsive">
            <Table bordered hover>
            <tbody>
                {objects.map((object, index)=>{
                    if(object.id == 0){
                        return(
                            <tr key={index}>
                            {objects.map((object, index)=>{
                                if(object.id < 6){
                                    return(
                                        <td key={index}>{object.nome}</td>
                                    )
                                }
                            })}
                            </tr>
                        )
                    }else if(object.id == 6){
                        return(
                            <tr key={index}>
                            {objects.map((object, index)=>{
                                if(object.id < 12 && object.id >=6){
                                    return(
                                        <td key={index}>{object.nome}</td>
                                    )
                                }
                            })}
                            </tr>
                        )
                    }else if(object.id == 12){
                        return(
                            <tr key={index}>
                            {objects.map((object, index)=>{
                                if(object.id < 18 && object.id >=12){
                                    return(
                                        <td key={index}>{object.nome}</td>
                                    )
                                }
                            })}
                            </tr>
                        )
                    }else if(object.id == 18){
                        return(
                            <tr key={index}>
                            {objects.map((object, index)=>{
                                if(object.id < 24 && object.id >=18){
                                    return(
                                        <td key={index}>{object.nome}</td>
                                    )
                                }
                            })}
                            </tr>
                        )
                    }else if(object.id == 24){
                        return(
                            <tr key={index}>
                            {objects.map((object, index)=>{
                                if(object.id < 30 && object.id >=24){
                                    return(
                                        <td key={index}>{object.nome}</td>
                                    )
                                }
                            })}
                            </tr>
                        )
                    }else if(object.id == 30){
                        return(
                            <tr key={index}>
                            {objects.map((object, index)=>{
                                if(object.id < 36 && object.id >=30){
                                    return(
                                        <td key={index}>{object.nome}</td>
                                    )
                                }
                            })}
                            </tr>
                        )
                    }
                }
                )};
            </tbody>
            </Table>
        </div>
        </>
    );
  }
  
  export default GameComponent;
  */