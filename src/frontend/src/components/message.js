import { Col, Row } from "react-bootstrap";

const Message = ({ text, image, file, time, sender }) => {
    const dir = sender === '1' ? "justify-content-end" : "justify-content-start";
    const textDir = sender === '1' ? "text-start" : "text-end";
    const timeDir = sender === '1' ? "text-end" : "text-start";
    return (
        <Row className={dir + " mx-0"}>
            <Col sm={10}>
                <div className={"d-flex "+dir+" w-100"}>
                    <div className="message-div">
                        <div className='message-container'>
                            { text ? <div className={textDir + " message-text"}>{text}</div> : '' }
                            { image ? <img src={image} alt='message' /> : '' }
                        </div>
                        <div className={timeDir +  " message-time"}>{time.getTime()}</div>
                    </div>
                </div>
               
            </Col>
        </Row>
     );
}
 
export default Message;