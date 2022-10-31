import Contact from "./contact"; 
import "../styles/contact.css";
import { Row, Col, Form } from "react-bootstrap";
import { Icon } from '@iconify/react';
import profileIMage from "../images/female-av.png";
import { useState } from "react";
import AddContactModal from "./add-contact";

const Contacts = () => {
    const [newContact, setNewContact] = useState({ show:false })
    const [contacts, setContacts] = useState([...contactArray]);
    const handleSearch = e => {
        const text = e.target.value;
        const filtered = contactArray.filter(f => f.name.includes(text));
        setContacts([...filtered]);
    }
    const addContact = e => {
        setNewContact(s => ({...s, show:true }))
    }
    return (
        <div className="py-3 contact-col">
            <Row className="justify-content-between py-2 mx-0">
                <Col sm="3">
                    <img width="35" height="35" className="rounded-pill border" src={profileIMage} alt="contact" />
                </Col>
                <Col sm="5">
                    <div className="fs-5 fw-bold text-left">Chats</div>
                </Col>
                <Col sm="3">
                    <div className="rounded-pill contact-menu bg-light" title="Add new contact" onClick={addContact}>
                        <Icon className="text-dark fs-5" icon="akar-icons:plus"  />
                    </div>
                </Col>
            </Row>
            <div className="px-2">
                <Form.Control type="text" placeholder="&#128269; Search" className="contact-search" onInput={handleSearch} />
            </div>
            <div className="con-div">
             {
                contacts.length > 0 ?
                        contacts.map((c, i) => <Contact key={i} {...c} />)
                        :
                        <small>No contacts found.</small>
             }
            </div>
           <AddContactModal obj={newContact} setShow={setNewContact} />
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