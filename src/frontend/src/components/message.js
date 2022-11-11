import { Icon } from "@iconify/react";
import { Col, Row } from "react-bootstrap";

const Message = ({ text, image, imagePath, id, time, sender, setViewImage, userPhone,status }) => {
    const isSent = sender === userPhone;
    const dir = isSent ? "justify-content-end" : "justify-content-start";
    const timeDir = isSent ? "text-end" : "text-start";
    time = new Date(time).toLocaleTimeString();
    let icon = "";
    if (isSent) {
        if (status === "PENDING") icon = <Icon className="ms-2" icon="pajamas:status-waiting" />;
        if (status === "SENT") icon = <Icon className="ms-2" icon="emojione-v1:left-check-mark" />;
        if (status === "REJECTED") icon = <Icon className="ms-2" icon="flat-color-icons:cancel" />;
        if (status === "DELIVERED") icon = <Icon className="ms-2" icon="emojione-v1:left-check-mark" />;
    }
    const viewImage = e => {
        const img = imagePath ? imagePath : image;
        setViewImage(s => ({
            ...s, image: img, show: true
        }))
    }
    return (
        <Row className={dir + " mx-0"}>
            <Col sm={10}>
                <div className={"d-flex "+dir+" w-100"}>
                    <div className="message-div">
                        <div className='message-container'>
                            {(image || imagePath) ?
                                <figure className="position-relative mb-1">
                                    <img onClick={viewImage} src={imagePath || image} alt='message' className="msg-image" />
                                    <figcaption className={`image-progress progress${id}`}></figcaption>
                                </figure>
                                : ''
                            }
                            { text ? <div className={"text-start message-text"}>{text}</div> : '' }
                        </div>
                        <div className={timeDir + " message-time"}>
                            <small>{time}</small>
                            {icon}
                        </div>
                    </div>
                </div>
               
            </Col>
        </Row>
     );
}
 
export default Message;