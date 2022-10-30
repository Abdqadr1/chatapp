import { Badge, Col, Row } from "react-bootstrap";
import profileIMage from "../images/female-av.png";

const Contact = ({name, time, unread, last_msg}) => {
    return (
        <div>
          <Row className="justify-content-between py-2 border-bottom">
            <Col sm="2">
              <img width="35" height="35" className="rounded-pill border" src={profileIMage} alt="contact" />
            </Col>
            <Col sm="7">
                <div className="chat-name">{name}</div>
                <div className="last-msg">{last_msg}</div>
            </Col>
            <Col sm="2">
              {(unread && unread > 0) ? <Badge className="rounded-pill unread-badge" bg="warning">{unread}</Badge> : ""}
            </Col>
          </Row>
        </div>
      );
}
 
export default Contact;