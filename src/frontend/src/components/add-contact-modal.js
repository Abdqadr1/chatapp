
import { useEffect, useRef, useState } from "react"
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";
import { addContactToStorage, isTokenExpired, SPINNERS_BORDER_HTML } from "./utilities";
const AddContactModal = ({ obj, setShow, callback, auth }) => {
    const [inputRef, abortRef, selectRef, btnRef, alertRef] = [useRef(), useRef(), useRef(), useRef(), useRef()];
    const [countries, setCountries] = useState([]);
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const url = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();

    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    useEffect(() => {
        abortRef.current = new AbortController();
        axios.get('http://api-env.eba-irpspqyp.us-east-1.elasticbeanstalk.com/country/all',
            { signal: abortRef.current.signal }
        )
            .then(res => setCountries(res.data))
            .catch(() => setAlert({ show: true, message: "Could not fetch countries" }))
        return () => abortRef?.current.abort();
    }, [abortRef]);

    const changeCallCode = e => {
        inputRef.current.value = e.target.value;
    }

    const findContact = e => {
        e.preventDefault();
        const target = e.target;
        let number = inputRef?.current.value;
        if (number.startsWith("0")) number = number.substring(1);
        const btn = target.querySelector("button[type='submit']");
        const txt = btn.textContent;
        btn.innerHTML = SPINNERS_BORDER_HTML;
        axios.get(`${url}/search-number/${number}`,
            {
                signal: abortRef.current?.signal,
                headers: {
                    Authorization: `Bearer ${auth.access_token}`
                }
            })
            .then(res => {
                setAlert(s => ({...s,  show: false}))
                const { phoneNumber, name, photo } = res.data;
                const c = {
                    key: phoneNumber,name,
                    phoneNumber: phoneNumber,
                    last_msg: "",
                    time: new Date(),
                    unread: 0,
                    photo
                }
                addContactToStorage(auth?.phoneNumber, c);
                callback(c);
                hideModal();
            })
            .catch(err => {
                isTokenExpired(err, () => navigate("/login"))
                setAlert({ show: true, message: "could not find contact" })
            })
            .finally(() => btn.textContent = txt);
    }

    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p className="text-start">Find By Phone Number</p>
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form onSubmit={findContact}>
                    <div className="d-flex justify-content-between align-items-center">
                        <Form.Select ref={selectRef} className="add-select" id="countrySelect" defaultValue={''} onChange={changeCallCode}>
                            <option value='' hidden>---</option>
                            {
                                countries.map(c => <option key={c.code} value={c.callCode}>{c.code} ({c.callCode})</option>)
                            }
                        </Form.Select>
                        <Form.Control ref={inputRef} type='phone' name="number" className="add-input" placeholder="phone number" required />
                    </div>
                    <Button className="add-btn" type='submit' variant="primary">Add Contact</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hideModal}> Close </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddContactModal;