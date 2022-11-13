import { Col, Row } from "react-bootstrap";
import profileIMage from "../images/female-av.png";
import { getShortName } from "./utilities";

const Contact = ({ obj, setCurrentChat, current }) => {
  const { name, last_msg, photo, phoneNumber } = obj;
  const img = photo ? photo : profileIMage;
  const handleClick = () => {
      if (!current?.phoneNumber ||
        current.phoneNumber !== phoneNumber
    ) setCurrentChat({ ...obj })
  }
    return (
          <Row className="justify-content-between py-2 border-bottom mx-0 contact" onClick={handleClick}>
            <Col sm="2">
              <img width="35" height="35" className="rounded-pill border" src={img} alt="contact" />
            </Col>
            <Col sm="10">
                <div className="chat-name">{getShortName(name, 30)}</div>
                <div className="last-msg">{getShortName(last_msg, 30)}</div>
            </Col>
            {/* <Col sm="2" className="px-0 d-flex align-items-center">
              {(unread && unread > 0) ? <Badge className="rounded-pill unread-badge" bg="warning">{unread}</Badge> : ""}
            </Col> */}
          </Row>
      );
}
 
export default Contact;