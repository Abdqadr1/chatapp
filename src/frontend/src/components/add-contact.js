import { useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
const AddContactModal = ({ obj, setShow, callback }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    const inputRef = useRef();
    const findContact = e => {
        console.log("looking for " + inputRef.current.value)
    }
    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p className="text-start">Find By Phone Number</p>
                <Form.Control ref={inputRef} type='phone' name="number" className="" placeholder="phone number..." />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hideModal}> Close </Button>
                <Button variant="primary" onClick={findContact}> Find </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddContactModal;