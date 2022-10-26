import { Row, Col } from "react-bootstrap";
import Contacts from "./contacts";
const ChatPage = () => {
    return ( 
        <div className="px-3">
            <Row className="justify-content-center">
                <Col sm="3">
                    <Contacts />
                </Col>
                <Col sm="6">chat</Col>
                <Col sm="3">info</Col>
            </Row>
        </div>
     );
}
 
export default ChatPage;