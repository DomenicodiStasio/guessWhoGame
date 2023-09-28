import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Row, Col } from 'react-bootstrap';

function GameHistoryItem(props) {
    const history = [...props.games];  // make a shallow copy

    return (
    <>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Level</th>
                <th>Secret object</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
            {history.map((e) =>
                    <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>{e.level}</td>
                    <td>{e.secretObject}</td>
                    <td>{e.score}</td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}

export default GameHistoryItem;
