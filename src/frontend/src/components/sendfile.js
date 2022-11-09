import { Icon } from "@iconify/react";
import { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
const SendFileModal = ({ obj, setShow, callback, sendMessage }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    const [inputRef] = [useRef()];

    const sendMsg = e => {
         const msg = {
            text: inputRef?.current?.value || "",
            image: obj?.image,
            time: new Date(),
            status: "PENDING"
        }
        sendMessage(msg, obj?.file);
        hideModal();
    }

    const sendTheMsg = e => {
        if (e.keyCode === 13 && e.target.value !== "") sendMessage();
    }

    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center">
                <img src={obj.image} alt='message' height={400} className="modal-image" />
                  <div className="write-div d-flex align-items-center justify-content-between bg-light border">
                    <div className="right">
                        <input ref={inputRef} className="msg-input" type='text' name="text" placeholder="Type message..."
                            onKeyDown={sendTheMsg} />
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