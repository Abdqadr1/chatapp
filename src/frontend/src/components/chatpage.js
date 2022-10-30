import { Row, Col } from "react-bootstrap";
import Chat from "./chat";
import ContactInfo from "./contact-info";
import Contacts from "./contacts";
const ChatPage = () => {
    return ( 
        <div className="chat-page-container">
            <Row className="justify-content-center chat-row">
                <Col sm="3" className="border chat-col">
                    <Contacts />
                </Col>
                <Col sm="6" className="border chat-col">
                    <Chat />
                </Col>
                <Col sm="3" className="border chat-col px-0">
                    <ContactInfo />
                </Col>
            </Row>
        </div>
     );
}
 
export default ChatPage;