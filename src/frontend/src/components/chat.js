import { Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react"; 
import "../styles/chat.css";
import headerImage from "../images/male-av.png";
const Chat = ({name, image, status}) => {
    return ( 
        <div className="">
            <Row className="chat-header justify-content-between border-bottom py-3">
                <Col md={4}>
                    <div className="d-flex justify-content-start">
                        <img width="35" height="35" className="rounded-pill border" src={headerImage} alt="contact" />
                        <div className="ms-2">
                            <div className="contact-name">John Momoh</div>
                            <div className="last-msg">{ status ? "Active Now" : "Offline"}</div>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="d-flex justify-content-between">
                        <div className="header-icons-div" title="voice call">
                            <Icon className="text-secondary header-icons" icon="fluent:call-48-filled" />
                        </div>
                        <div className="header-icons-div" title="video call">
                            <Icon className="text-secondary header-icons" icon="wpf:video-call" />
                        </div>
                        <div className="header-icons-div" title="info">
                            <Icon className="text-secondary header-icons" icon="ant-design:info-circle-filled" />
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
     );
}
 
export default Chat;