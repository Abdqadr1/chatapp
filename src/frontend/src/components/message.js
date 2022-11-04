import { Col, Row } from "react-bootstrap";

const Message = ({ text, image, file, time, sender, setViewImage, userPhone }) => {
    const isSent = sender === userPhone;
    const dir = isSent ? "justify-content-end" : "justify-content-start";
    const timeDir = isSent ? "text-end" : "text-start";
    const viewImage = e => {
        setViewImage(s => ({
            ...s, image, show: true
        }))
    }
    return (
        <Row className={dir + " mx-0"}>
            <Col sm={10}>
                <div className={"d-flex "+dir+" w-100"}>
                    <div className="message-div">
                        <div className='message-container'>
                            { image ? <img onClick={viewImage} src={image} alt='message' className="msg-image" /> : '' }
                            { text ? <div className={"text-start message-text"}>{text}</div> : '' }
                        </div>
                        <div className={timeDir +  " message-time"}>{new Date(time).toLocaleTimeString()}</div>
                    </div>
                </div>
               
            </Col>
        </Row>
     );
}
 
export default Message;