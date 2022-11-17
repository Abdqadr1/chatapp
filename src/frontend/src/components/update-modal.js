import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import headerImage from "../images/male-av.png";
import { isFileValid, isTokenExpired, listFormData, showThumbnail, SPINNERS_BORDER_HTML } from "./utilities";

const UpdateModal = ({ obj, setShow, auth }) => {
    const { bio, imagePath } = obj.info;
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show });
    const imageAcceptArray = ["image/png", "image/jpg", "image/jpeg"];
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    const [abortRef, alertRef, imageRef] = [useRef(), useRef(), useRef()];
    const navigate = useNavigate();
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        abortRef.current = new AbortController();
        return () => abortRef.current.abort();
    }, [abortRef])

    const handleSelectImage = (event) => {
        if (!auth?.phoneNumber) {
            event.preventDefault();
            return;
        }
        const input = event.target;
        const file = input.files[0];
        const checkValid = isFileValid(file, imageAcceptArray);
        if (checkValid.validity) {
            showThumbnail(file, (data) => {
                imageRef.current.src = data;
            });
        } else {
            setAlert(s => ({...s, show: true, message: checkValid.message}))
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        const target = e.target;
        const btn = target.querySelector("button[type='submit']");
        const txt = btn.textContent;
        const data = new FormData(target);
        btn.innerHTML = SPINNERS_BORDER_HTML;
        listFormData(data);
        const url = `${serverUrl}/update-info`;
        axios.put(url, data, {
            signal: abortRef?.current.signal,
            headers: {
                Authorization: `Bearer ${auth.access_token}`
            }
        })
            .then(res => {
                console.log(res.data)
                setAlert(s => ({
                    ...s, show: true, variant: "success",
                    message: "Info updated"
                }))
                if (res.data) {
                    setShow(s => ({
                        ...s, 
                        info: {...s.info, imagePath: res.data, bio: data.get(bio) }
                    }))
                }
                
            })
            .catch(err => {
                isTokenExpired(err, () => navigate("/login"));
                setAlert(s => ({
                    ...s, show: true,variant: "danger",
                    message: err?.response?.data.message || "An error occurs updating info"
                }))
            })
            .finally(() => {
                btn.textContent = txt;
            });
    }

    return ( 
         <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton className="py-3 fs-6">Account Info</Modal.Header>
            <Modal.Body className="text-center pt-0">
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show}
                    dismissible onClose={toggleAlert}  className="my-2" >
                    <small>{alert.message}</small>
                </Alert>
                <div>
                    <Row className="justify-content-center border-bottom p-2">
                        <Col sm={4} className="image-el-col">
                            <figure className="img-fig">
                                <img ref={imageRef} src={imagePath || headerImage} alt="contact" className="info-image" />
                                <label htmlFor="profilePic" className="change-pic" title="change" >
                                    <Icon icon="bi:images" />
                                </label>
                            </figure>
                        </Col>
                    </Row>
                    
                    <Form className="mt-3" onSubmit={handleSubmit} >
                        <input onChange={handleSelectImage} type="file" name="image" className="d-none" id="profilePic"
                            accept="image/jpg, image/png, image/jpeg" />
                        <FloatingLabel controlId="floatingPassword" label="BIO">
                            <Form.Control className="bg-transparent border-secondary"  name="bio" defaultValue={bio ?? ""} maxLength={100} required />
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