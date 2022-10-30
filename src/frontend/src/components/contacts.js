import Contact from "./contact"; 
import "../styles/contact.css";
import { Row, Col, Badge, Form } from "react-bootstrap";
import { Icon } from '@iconify/react';
import profileIMage from "../images/female-av.png";
import { useState } from "react";

const Contacts = () => {
    const [contacts, setContacts] = useState([...contactArray]);
    const handleSearch = e => {
        const text = e.target.value;
        const filtered = contactArray.filter(f => f.name.includes(text));
        setContacts([...filtered]);
    }
    return (
        <div className="p-3">
            <Row className="justify-content-between py-2">
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
            <Form.Control type="text" placeholder="&#128269; Search" className="contact-search" onInput={handleSearch} />
            <div className="mt-3">
             {
                contacts.length > 0 ?
                        contacts.map((c, i) => <Contact key={i} {...c} />)
                        :
                        <small>No contacts found.</small>
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