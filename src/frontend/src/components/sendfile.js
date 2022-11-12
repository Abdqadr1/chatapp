import { Icon } from "@iconify/react";
import { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
const SendFileModal = ({ obj, setShow, callback, sendMessage }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    const [inputRef] = [useRef()];

    const sendMsg = e => {
        const msg = {
            type: "image",
            text: inputRef?.current?.value || "",
            image: obj?.image,
            time: new Date(),
            status: "PENDING",
            fileName: obj.file.name
        }
        sendMessage(msg, obj?.file);
        hideModal();
    }

    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center">
                <img src={obj.image} alt='message' height={400} className="modal-image mb-2" />
                  <div className="write-div d-flex align-items-center justify-content-between bg-light border">
                    <div className="right">
                        <input ref={inputRef} className="msg-input" type='text' name="text" placeholder="Type message..." />
                    </div>
                    <Icon icon="akar-icons:send" title="send" className="write-icon" onClick={sendMsg} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hideModal}> Close </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default SendFileModal;