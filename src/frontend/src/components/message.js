import { Icon } from "@iconify/react";
import { Col, Row } from "react-bootstrap";
import { fileTypeObj, formatDate, formatTime } from "./utilities";

const Message = ({userPhone, setViewImage, obj, index, compareTime}) => {
    let {  text, image, imagePath, id, time, sender,
     status, audioPath, wav, doc, docPath, document: docment } = obj;
    const isSent = sender === userPhone;
    const dir = isSent ? "justify-content-end" : "justify-content-start";
    const bg = isSent ? "sent" : "received";
    const timeDir = isSent ? "text-end" : "text-start";
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
    const soundURL = wav ? URL.createObjectURL(wav) : audioPath;
    const downloadDoc = e => {
        if (docPath) {
            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = docPath;
            link.setAttribute('download', docment); //or any other extension
            link.setAttribute("target", "blank");
            document.body.appendChild(link);
            link.click();
            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
        }
    }
    let docEl = "";
    if (doc || docPath) {
        const name = doc?.name || docPath;
        const ext = name.substring(name.lastIndexOf('.') + 1); 
        let ic = fileTypeObj?.[ext] || "akar-icons:file";
        const colours = ['text-danger', 'text-warning', 'text-primary', 'text-secondary']
        let col = colours[Math.floor(Math.random()*colours.length)];
        docEl = <div className="my-1 w-100 d-flex justify-content-start align-items-center py-1 position-relative" onClick={downloadDoc}>
            <Icon icon={ic} className={col} />
            <small className={`ms-1 ${col}`}>document</small>
            <div className={`image-progress progress${id}`}></div>
        </div>
    }
    return (
        <Row className={dir + " mx-0"}>
            { 
                compareTime(index) ? <Col className="day-diff" sm={12}>{ formatDate(time) }</Col> : ""
            }
            <Col sm={10}>
                <div className={"d-flex "+dir+" w-100"}>
                    <div className="message-div">
                        <div className={`message-container ${bg}`}>
                            {(image || imagePath) ?
                                <figure className="position-relative mb-1">
                                    <img onClick={viewImage} src={image || imagePath} alt='message' className="msg-image" />
                                    <figcaption className={`image-progress progress${id}`}></figcaption>
                                </figure>
                                : ''
                            }
                            {text ? <div className={"text-start message-text"}>{text}</div> : ''}
                            {
                                (audioPath || wav) ? 
                                    <div className="position-relative mb-1 w-75 fs-6">
                                        <audio src={soundURL} controls></audio>
                                        <div className={`image-progress progress${id}`}></div>
                                    </div>
                                : ""
                            }
                            {docEl}
                        </div>
                        <div className={timeDir + " message-time"}>
                            <small>{formatTime(time)}</small>
                            {icon}
                        </div>
                    </div>
                </div>
               
            </Col>
        </Row>
     );
}
 
export default Message;