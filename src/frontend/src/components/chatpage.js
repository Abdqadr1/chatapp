import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Navigate } from "react-router";
import Chat from "./chat";
import ContactInfo from "./contact-info";
import Contacts from "./contacts";
const ChatPage = () => {
    const [currentChat, setCurrentChat] = useState({});
    const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");

    // get messages here
    
    if (!auth?.access_token || !auth?.phoneNumber) return <Navigate to="/login" />;
    return ( 
        <div className="chat-page-container">
            <Row className="justify-content-center chat-row">
                <Col sm="3" className="border chat-col px-0">
                    <Contacts setCurrentChat={setCurrentChat} />
                </Col>
                <Col sm="6" className="border chat-col">
                    <Chat auth={auth} contact={currentChat} />
                </Col>
                <Col sm="3" className="border chat-col px-0">
                    <ContactInfo currentChat={currentChat} />
                </Col>
            </Row>
        </div>
     );
}
 
export default ChatPage;