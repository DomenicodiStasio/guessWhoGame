import React, { useState, useContext } from 'react';
import { Table, Dropdown, Button, ButtonGroup, Container, Row, Col } from 'react-bootstrap';
import MessageContext from '../messageCtx';
import API from '../API'; 

function TryComponent(props) {
    const setSelectedObject = props.setSelectedObject;
    const setNumTry = props.setNumTry;
    const numTry = props.numTry;
    const showAlert = props.showAlert;
    const handleDisableImages = props.handleDisableImages;
    const setPropertyState = props.setPropertyState;
    const propertyState = props.propertyState;
    const tryDisabled = props.tryDisabled;
    const alerts = props.alerts;
    const dismissAlert = props.dismissAlert;
    const gameId = props.gameId;
    const objects = props.objects;


    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const {handleErrors} = useContext(MessageContext);

    const handleTryClick = async() => {
        setNumTry(numTry+1);
        setSelectedObject({});
        let hintResult;
        if(!(selectedProperty && selectedValue)){
            showAlert('Select Property and Value first.', '', 'danger');
            return;
        }
        await API.getHint(gameId, selectedProperty, selectedValue)
        .then(resultHint => {
            hintResult = resultHint;
      })
      .catch(e => { 
        showAlert('Error: ', 'error trying to get hint: '+e.error, 'warning');
      } );
        if (hintResult['hint'] == 'yes') {
            handleDisableImages(1, selectedProperty, selectedValue, objects);
            showAlert('Result: ' + hintResult['hint'], `(Property: ${selectedProperty}, Value: ${selectedValue})`, 'success');
        } else if (hintResult['hint'] == 'no'){
            handleDisableImages(0, selectedProperty, selectedValue, objects);
            showAlert('Result: ' + hintResult['hint'], `(Property: ${selectedProperty}, Value: ${selectedValue})`, 'danger');
        } else {
            showAlert('Warning','Application internal problem', 'warning');
            return;
        }

        //setPropertyState();
        if(selectedProperty == 'type'){
            let newPropertyState = propertyState;
            newPropertyState[selectedProperty] = {property: false, frutta: false, verdura: false};
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'color'){
            let newPropertyState = propertyState;
            if(selectedValue == 'arancione'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: false,                                        rossa: newPropertyState[selectedProperty].rossa,  verde: newPropertyState[selectedProperty].verde,  giallo: newPropertyState[selectedProperty].giallo,  viola: newPropertyState[selectedProperty].viola,  bianco: newPropertyState[selectedProperty].bianco,  rosa: newPropertyState[selectedProperty].rosa};
            }else if(selectedValue == 'rossa'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: newPropertyState[selectedProperty].arancione, rossa: false,                                     verde: newPropertyState[selectedProperty].verde,  giallo: newPropertyState[selectedProperty].giallo,  viola: newPropertyState[selectedProperty].viola,  bianco: newPropertyState[selectedProperty].bianco,  rosa: newPropertyState[selectedProperty].rosa};
            }else if(selectedValue == 'verde'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: newPropertyState[selectedProperty].arancione, rossa: newPropertyState[selectedProperty].rossa,  verde: false,                                     giallo: newPropertyState[selectedProperty].giallo,  viola: newPropertyState[selectedProperty].viola,  bianco: newPropertyState[selectedProperty].bianco,  rosa: newPropertyState[selectedProperty].rosa};
            }else if(selectedValue == 'giallo'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: newPropertyState[selectedProperty].arancione, rossa: newPropertyState[selectedProperty].rossa,  verde: newPropertyState[selectedProperty].verde,  giallo: false,                                      viola: newPropertyState[selectedProperty].viola,  bianco: newPropertyState[selectedProperty].bianco,  rosa: newPropertyState[selectedProperty].rosa};
            }else if(selectedValue == 'viola'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: newPropertyState[selectedProperty].arancione, rossa: newPropertyState[selectedProperty].rossa,  verde: newPropertyState[selectedProperty].verde,  giallo: newPropertyState[selectedProperty].giallo,  viola: false,                                     bianco: newPropertyState[selectedProperty].bianco,  rosa: newPropertyState[selectedProperty].rosa};
            }else if(selectedValue == 'bianco'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: newPropertyState[selectedProperty].arancione, rossa: newPropertyState[selectedProperty].rossa,  verde: newPropertyState[selectedProperty].verde,  giallo: newPropertyState[selectedProperty].giallo,  viola: newPropertyState[selectedProperty].viola,  bianco: false,                                      rosa: newPropertyState[selectedProperty].rosa};
            }else if(selectedValue == 'rosa'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, arancione: newPropertyState[selectedProperty].arancione, rossa: newPropertyState[selectedProperty].rossa,  verde: newPropertyState[selectedProperty].verde,  giallo: newPropertyState[selectedProperty].giallo,  viola: newPropertyState[selectedProperty].viola,  bianco: newPropertyState[selectedProperty].bianco,  rosa: false};
            }
            if( (!newPropertyState[selectedProperty].arancione  && !newPropertyState[selectedProperty].rossa        && !newPropertyState[selectedProperty].verde        && !newPropertyState[selectedProperty].giallo       && !newPropertyState[selectedProperty].viola        && !newPropertyState[selectedProperty].bianco)      || 
                (!newPropertyState[selectedProperty].rosa       && !newPropertyState[selectedProperty].arancione    && !newPropertyState[selectedProperty].rossa        && !newPropertyState[selectedProperty].verde        && !newPropertyState[selectedProperty].giallo       && !newPropertyState[selectedProperty].viola)       ||
                (!newPropertyState[selectedProperty].bianco     && !newPropertyState[selectedProperty].rosa         && !newPropertyState[selectedProperty].arancione    && !newPropertyState[selectedProperty].rossa        && !newPropertyState[selectedProperty].verde        && !newPropertyState[selectedProperty].giallo)      || 
                (!newPropertyState[selectedProperty].viola      && !newPropertyState[selectedProperty].bianco       && !newPropertyState[selectedProperty].rosa         && !newPropertyState[selectedProperty].arancione    && !newPropertyState[selectedProperty].rossa        && !newPropertyState[selectedProperty].verde)       || 
                (!newPropertyState[selectedProperty].giallo     && !newPropertyState[selectedProperty].viola        && !newPropertyState[selectedProperty].bianco       && !newPropertyState[selectedProperty].rosa         && !newPropertyState[selectedProperty].arancione    && !newPropertyState[selectedProperty].rossa)       || 
                (!newPropertyState[selectedProperty].verde      && !newPropertyState[selectedProperty].giallo       && !newPropertyState[selectedProperty].viola        && !newPropertyState[selectedProperty].bianco       && !newPropertyState[selectedProperty].rosa         && !newPropertyState[selectedProperty].arancione)   || 
                (!newPropertyState[selectedProperty].rossa      && !newPropertyState[selectedProperty].verde        && !newPropertyState[selectedProperty].giallo       && !newPropertyState[selectedProperty].viola        && !newPropertyState[selectedProperty].bianco       && !newPropertyState[selectedProperty].rosa))
            {
                newPropertyState[selectedProperty] = {property: false, arancione: false, rossa: false,  verde: false,  giallo: false,  viola: false,  bianco: false,  rosa: false};
            }
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'season'){
            let newPropertyState = propertyState;
            newPropertyState[selectedProperty] = {property: false, estate: false, inverno: false};
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'taste'){
            let newPropertyState = propertyState;
            if(selectedValue == 'dolce'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, dolce: false, amaro: newPropertyState[selectedProperty].amaro, neutro: newPropertyState[selectedProperty].neutro};
            }else if(selectedValue == 'amaro'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, dolce: newPropertyState[selectedProperty].dolce, amaro: false, neutro: newPropertyState[selectedProperty].neutro};
            }else if(selectedValue == 'neutro'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, dolce: newPropertyState[selectedProperty].dolce, amaro: newPropertyState[selectedProperty].amaro, neutro: false};
            }
            if((!newPropertyState[selectedProperty].dolce && !newPropertyState[selectedProperty].amaro) || 
               (!newPropertyState[selectedProperty].amaro && !newPropertyState[selectedProperty].neutro) ||
               (!newPropertyState[selectedProperty].dolce && !newPropertyState[selectedProperty].neutro)){
                newPropertyState[selectedProperty] = {property: false, dolce: false, amaro: false, neutro: false};
               }
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'seeds'){
            let newPropertyState = propertyState;
            newPropertyState[selectedProperty] = {property: false, seedsyes: false, noseeds: false};
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'tree'){
            let newPropertyState = propertyState;
            newPropertyState[selectedProperty] = {property: false, fromtree: false, notfromtree: false};
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'peel'){
            let newPropertyState = propertyState;
            if(selectedValue == 'liscia'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, liscia: false,                                     ruvida: newPropertyState[selectedProperty].ruvida,  pelosa: newPropertyState[selectedProperty].pelosa,  assente: newPropertyState[selectedProperty].assente};
            }else if(selectedValue == 'ruvida'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, liscia: newPropertyState[selectedProperty].liscia, ruvida: false,                                      pelosa: newPropertyState[selectedProperty].pelosa,  assente: newPropertyState[selectedProperty].assente};
            }else if(selectedValue == 'pelosa'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, liscia: newPropertyState[selectedProperty].liscia, ruvida: newPropertyState[selectedProperty].ruvida,  pelosa: false,                                      assente: newPropertyState[selectedProperty].assente};
            }else if(selectedValue == 'assente'){
                newPropertyState[selectedProperty] = {property: newPropertyState[selectedProperty].property, liscia: newPropertyState[selectedProperty].liscia, ruvida: newPropertyState[selectedProperty].ruvida,  pelosa: newPropertyState[selectedProperty].pelosa,  assente: false};
            }
            if((!newPropertyState[selectedProperty].liscia && !newPropertyState[selectedProperty].ruvida  && !newPropertyState[selectedProperty].pelosa) || 
               (!newPropertyState[selectedProperty].ruvida && !newPropertyState[selectedProperty].pelosa && !newPropertyState[selectedProperty].assente) ||
               (!newPropertyState[selectedProperty].pelosa && !newPropertyState[selectedProperty].assente && !newPropertyState[selectedProperty].liscia) ||
               (!newPropertyState[selectedProperty].assente && !newPropertyState[selectedProperty].liscia && !newPropertyState[selectedProperty].ruvida)){
                newPropertyState[selectedProperty] = {property: false, liscia: false, ruvida: false,  pelosa: false,  assente: false};
               }
            setPropertyState(newPropertyState);
        }else if(selectedProperty == 'juice'){
            let newPropertyState = propertyState;
            newPropertyState[selectedProperty] = {property: false, hasjuice: false, nojuice: false};
            setPropertyState(newPropertyState);
        }

        setSelectedProperty('');
        setSelectedValue('');
    };


    const handleSelectedProperty = (eventKey) => {
        setSelectedProperty(eventKey);
        setSelectedValue('');
    };

    return (
        <>
        <Container className="p-3 d-flex justify-content-center">
                <Table>
                    <tbody>
                        <tr>
                            <td>Ask property:</td>
                            <td>
                                <Dropdown onSelect={(eventKey) => handleSelectedProperty(eventKey)}>
                                    <Dropdown.Toggle variant="secondary" id="property-dropdown">
                                        {selectedProperty || 'Select Property'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            propertyState.type.property ? <Dropdown.Item eventKey="type">type</Dropdown.Item> :  null
                                        }{
                                            propertyState.color.property ? <Dropdown.Item eventKey="color">color</Dropdown.Item> :  null
                                        }{    
                                            propertyState.season.property ? <Dropdown.Item eventKey="season">season</Dropdown.Item> :  null 
                                        }{    
                                            propertyState.taste.property ? <Dropdown.Item eventKey="taste">taste</Dropdown.Item> :  null
                                        }{    
                                            propertyState.seeds.property ? <Dropdown.Item eventKey="seeds">seeds</Dropdown.Item> :  null
                                        }{    
                                            propertyState.tree.property ? <Dropdown.Item eventKey="tree">tree</Dropdown.Item> :  null
                                        }{    
                                            propertyState.peel.property ? <Dropdown.Item eventKey="peel">peel</Dropdown.Item> :  null
                                        }{    
                                            propertyState.juice.property ? <Dropdown.Item eventKey="juice">juice</Dropdown.Item> :  null
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <Dropdown onSelect={(eventKey) => setSelectedValue(eventKey)}>
                                    <Dropdown.Toggle disabled={!selectedProperty} variant="secondary" id="value-dropdown">
                                        {selectedValue || 'Select Value'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            selectedProperty == "type" && propertyState.type.frutta ? <Dropdown.Item eventKey="frutta">frutta</Dropdown.Item> : null
                                        }{     
                                            selectedProperty == "type" && propertyState.type.verdura ? <Dropdown.Item eventKey="verdura">verdura</Dropdown.Item> : null 
                                        }{     
                                            selectedProperty == "color" && propertyState.color.arancione ? <Dropdown.Item eventKey="arancione">arancione</Dropdown.Item> : null 
                                        }{    
                                            selectedProperty == "color" && propertyState.color.rossa ? <Dropdown.Item eventKey="rossa">rossa</Dropdown.Item> : null 
                                        }{    
                                            selectedProperty == "color" && propertyState.color.verde ? <Dropdown.Item eventKey="verde">verde</Dropdown.Item> : null 
                                        }{    
                                            selectedProperty == "color" && propertyState.color.giallo ? <Dropdown.Item eventKey="giallo">giallo</Dropdown.Item> : null 
                                        }{    
                                            selectedProperty == "color" && propertyState.color.viola ? <Dropdown.Item eventKey="viola">viola</Dropdown.Item> : null 
                                        }{    
                                            selectedProperty == "color" && propertyState.color.bianco ? <Dropdown.Item eventKey="bianco">bianco</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "color" && propertyState.color.rosa ? <Dropdown.Item eventKey="rosa">rosa</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "season" && propertyState.season.estate ? <Dropdown.Item eventKey="estate">estate</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "season" && propertyState.season.inverno ? <Dropdown.Item eventKey="inverno">inverno</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "taste" && propertyState.taste.dolce ? <Dropdown.Item eventKey="dolce">dolce</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "taste" && propertyState.taste.amaro ? <Dropdown.Item eventKey="amaro">amaro</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "taste" && propertyState.taste.neutro ? <Dropdown.Item eventKey="neutro">neutro</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "seeds" && propertyState.seeds.seedsyes ? <Dropdown.Item eventKey="seedsyes">seedsyes</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "seeds" && propertyState.seeds.noseeds ? <Dropdown.Item eventKey="noseeds">noseeds</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "tree" && propertyState.tree.fromtree ? <Dropdown.Item eventKey="fromtree">fromtree</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "tree" && propertyState.tree.notfromtree ? <Dropdown.Item eventKey="notfromtree">notfromtree</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "peel" && propertyState.peel.ruvida ? <Dropdown.Item eventKey="ruvida">ruvida</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "peel" && propertyState.peel.liscia ?  <Dropdown.Item eventKey="liscia">liscia</Dropdown.Item>  : null
                                        }{     
                                            selectedProperty == "peel" && propertyState.peel.pelosa ? <Dropdown.Item eventKey="pelosa">pelosa</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "peel" && propertyState.peel.assente ? <Dropdown.Item eventKey="assente">assente</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "juice" && propertyState.juice.hasjuice ? <Dropdown.Item eventKey="hasjuice">hasjuice</Dropdown.Item>  : null
                                        }{    
                                            selectedProperty == "juice" && propertyState.juice.nojuice ? <Dropdown.Item eventKey="nojuice">nojuice</Dropdown.Item>  : null
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <Button disabled={tryDisabled || !selectedValue} variant="primary" onClick={handleTryClick}>
                                    Try
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
        </Container>
        <div>
            <div id="alert-container" className="p-3 d-flex justify-content-center">
                {alerts.map((alert, index) => (
                    <div key={index} className={`alert mx-1 alert-${alert.variant}`} role="alert">
                        <strong>{alert.title}</strong> {alert.message}
                        <Row>
                            <Col>
                                <ButtonGroup className="d-flex mt-2">
                        <Button className="d-flex" variant={alert.variant} onClick={() => dismissAlert(index)}>Hide</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        </div>
        </>
        
    );
}  

export default TryComponent;
