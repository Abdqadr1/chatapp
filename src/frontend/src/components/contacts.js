import Contact from "./contact"; 
import "../styles/contact.css";
import { Row, Col, Form } from "react-bootstrap";
import { Icon } from '@iconify/react';
import profileIMage from "../images/female-av.png";
import { useState } from "react";
import AddContactModal from "./add-contact-modal";

const Contacts = ({ setCurrentChat, contacts, setContacts, auth, searchContact, currentChat, setUpdateInfo, info }) => {
    const [newContactModal, setNewContactModal] = useState({ show: false });
    const handleSearch = e => {
        const text = e.target.value;
        searchContact(text);
    }
    const addContact = e => {
        setNewContactModal(s => ({...s, show:true }))
    }

    const addNewContact = (obj) => {
        const index = contacts.findIndex(c => c.phoneNumber === obj.phoneNumber);
        if (index > -1) {
            const c = contacts[index];
            c.name = obj.name;
            c.photo = obj.photo;
            setContacts(s => ([...s]));
        } else {
            setContacts(s => ([obj, ...s]));

        }
    }


    return (
        <div className="py-3 contact-col">
            <Row className="justify-content-between py-2 mx-0">
                <Col sm="3">
                    <img width="35" height="35" className="rounded-pill border" src={info?.imagePath|| profileIMage}
                        alt="contact" onClick={()=> setUpdateInfo(s=>({...s, show:true}))} />
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
                        contacts.map((c, i) => <Contact key={c.phoneNumber} obj={c} current={currentChat} setCurrentChat={setCurrentChat} />)
                        :
                        <small>No contacts found.</small>
             }
            </div>
           <AddContactModal obj={newContactModal} setShow={setNewContactModal} callback={addNewContact} auth={auth} />
        </div>
    );
}

export default Contacts;