import Contact from "./contact"; 
import "../styles/contact.css";
import { Row, Col, Badge, Form } from "react-bootstrap";
import { Icon } from '@iconify/react';
import profileIMage from "../images/female-av.png";

const Contacts = () => {
    return (
        <div className="p-3">
            <Row className="justify-content-betweenpy-2">
                <Col sm="3">
                    <img width="35" height="35" className="rounded-pill border" src={profileIMage} alt="contact" />
                </Col>
                <Col sm="5">
                    <div className="fs-5 fw-bold text-left">Chats</div>
                </Col>
                <Col sm="3">
                    <Badge className="rounded contact-menu" bg="light" title="Menu">
                        <Icon className="text-dark fs-5" icon="carbon:overflow-menu-horizontal" />
                    </Badge>
                </Col>
            </Row>
            <Form.Control type="text" placeholder="Search" className="contact-search" />
            <div className="mt-3">
             {
                contactArray.map((c, i) => <Contact key={i} {...c} />)
             }
            </div>
           
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
    },
    {
        name: "full name",
        last_msg: "I'm coming home.",
        time: new Date(),
        unread: 0,
        image: "image"
    },
    {
        name: "full name2",
        last_msg: "I'm going home.",
        time: new Date(),
        unread: 2,
        image: "image"
    },
    {
        name: "full name",
        last_msg: "I'm coming home.",
        time: new Date(),
        unread: 1,
        image: "image"
    },
    {
        name: "full name2",
        last_msg: "I'm going home.",
        time: new Date(),
        unread: 0,
        image: "image"
    }
]
 
export default Contacts;