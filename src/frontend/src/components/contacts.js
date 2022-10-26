import Contact from "./contact"; 
import "../styles/contact.css";
import { Row, Col, Badge } from "react-bootstrap";
import profileIMage from "../images/female-av.png";

const Contacts = () => {
    return (
        <div>
            <Row className="justify-content-between px-3 py-2">
                <Col sm="2">
                    <img width="35" height="35" className="rounded-pill border" src={profileIMage} alt="contact" />
                </Col>
                <Col sm="7">
                    <div className="contact-name fs-5">Chats</div>
                </Col>
                <Col sm="2">
                    <Badge className="rounded-pill unread-badge" bg="secondary">
                        
                    </Badge>
                </Col>
            </Row>
            {
                contactArray.map((c, i) => <Contact key={i} {...c} />)
            }
        </div>
    );
}

const contactArray = [
    {
        name: "full name",
        last_msg: "I'm coming home.",
        time: new Date(),
        unread: 4,
        image: "image"
    },
    {
        name: "full name2",
        last_msg: "I'm going home.",
        time: new Date(),
        unread: 2,
        image: "image"
    }
]
 
export default Contacts;