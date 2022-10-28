import { Row, Col } from "react-bootstrap";
import Chat from "./chat";
import Contacts from "./contacts";
const ChatPage = () => {
    return ( 
        <div className="px-3">
            <Row className="justify-content-center">
                <Col sm="3" className="border">
                    <Contacts />
                </Col>
                <Col sm="6" className="border">
                    <Chat />
                </Col>
                <Col sm="3" className="border">info</Col>
            </Row>
        </div>
     );
}
 
export default ChatPage;