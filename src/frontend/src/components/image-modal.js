import { Modal, Button } from "react-bootstrap";
const ImageModal = ({ obj, setShow, callback }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));
    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="text-center">
               <img src={obj.image} alt='message' height={400} className="modal-image" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={hideModal}> Close </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default ImageModal;