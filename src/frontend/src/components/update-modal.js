import { useState } from "react";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import headerImage from "../images/male-av.png";
import { isFileValid, showThumbnail } from "./utilities";

const UpdateModal = ({ obj, setShow, phoneNumber }) => {
    const { bio, imagePath, photo } = obj.info;
    const [message, setMessage] = useState("");
    const imageAcceptArray = ["image/png", "image/jpg", "image/jpeg"];
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    const handleSelectImage = (event) => {
            if (!phoneNumber) {
                event.preventDefault();
                return;
            }
            const input = event.target;
            const file = input.files[0];
            const checkValid = isFileValid(file, imageAcceptArray);
            if (checkValid.validity) {
                showThumbnail(file, (data) => {
                    // setPhotoModal(s=> ({...s, show: true, image: data, file}))
                });
            } else {
                setMessage(checkValid.message)
            }
    }

    const handleSubmit = e => {
        e.preventDefault();
    }

    return ( 
         <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton className="py-3 fs-6">Account Info</Modal.Header>
            <Modal.Body className="text-center pt-0">
                <div>
                    <div className="mb-3">{message}</div>
                    <Row className="justify-content-center border-bottom p-3">
                        <Col sm={4} className="image-el-col">
                            <figure className="">
                                <img src={imagePath || headerImage} alt="contact" className="info-image" />
                            </figure>
                        </Col>
                    </Row>
                    
                    <Form className="mt-3" onSubmit={handleSubmit} >
                        <input onChange={handleSelectImage} type="file" className="d-none" id="at-images"
                            accept="image/jpg, image/png, image/jpeg" />
                        <FloatingLabel controlId="floatingPassword" label="BIO">
                            <Form.Control name="bio" defaultValue={bio ?? ""} />
                        </FloatingLabel>
                        <div className="d-flex justify-content-end mt-3">
                            <Button type="submit" variant="success"> Update </Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
     );
}
 
export default UpdateModal;