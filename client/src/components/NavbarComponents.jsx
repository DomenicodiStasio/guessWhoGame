import { Navbar, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NavHeader(props) {
    const navigate = useNavigate();
    const setGameId = props.setGameId;
    const setEndGameInvisibility = props.setEndGameInvisibility;
    const setStartGameDisabled = props.setStartGameDisabled;

    const handleHomeClick = ()=>{
        setGameId(undefined);
        setEndGameInvisibility(true);
        setStartGameDisabled(false);
        navigate('/');
    };


    const name = props.user && props.user.name;
//<Button className='mx-2' variant='secondary' onClick={()=>{navigate('/history'); props.doSetDirty(true);}}>History</Button>
    return (
        <Navbar bg='primary' variant='dark'>
            <Container fluid>
                <Navbar.Brand className='fs-2' onClick={handleHomeClick}>IndovinaChi</Navbar.Brand>
                <Button className='mx-2' variant='secondary' onClick={handleHomeClick}>Home</Button>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    { name? <>
                    <Navbar.Text className='fs-5'>
                        {"Signed in as: "+name}
                    </Navbar.Text>
                    <Button className='mx-2' variant='secondary' onClick={()=>{navigate('/history'); props.doSetDirty(true);}}>History</Button>
                    <Button className='mx-2' variant='danger' onClick={props.logout}>Logout</Button>
                    </> : 
                    <Button className='mx-2' variant='warning' onClick={()=> navigate('/login')}>Login</Button> }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavHeader;