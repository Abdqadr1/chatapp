import { Badge, Col, Row } from "react-bootstrap";
import profileIMage from "../images/female-av.png";

const Contact = ({ obj, setCurrentChat }) => {
  const { name, last_msg, unread } = obj;
  const handleClick = e => {
    setCurrentChat({...obj})
  }
    return (
          <Row className="justify-content-between py-2 border-bottom mx-0 contact" onClick={handleClick}>
            <Col sm="2">
              <img width="35" height="35" className="rounded-pill border" src={profileIMage} alt="contact" />
            </Col>
            <Col sm="8">
                <div className="chat-name">{name}</div>
                <div className="last-msg">{last_msg}</div>
            </Col>
            <Col sm="2" className="px-0 d-flex align-items-center">
              {(unread && unread > 0) ? <Badge className="rounded-pill unread-badge" bg="warning">{unread}</Badge> : ""}
            </Col>
          </Row>
      );
}
 
export default Contact;