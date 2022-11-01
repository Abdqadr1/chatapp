import { Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react"; 
import "../styles/chat.css";
import headerImage from "../images/male-av.png";
import Message from "./message";
import { isFileValid, showThumbnail } from "./utilities";
import { useState } from "react";
import MessageModal from "./message_modal";
import ImageModal from "./image-modal";
const Chat = ({ name, image, status }) => {
    const [photos, setPhotos] = useState('');
    const [viewImage, setViewImage] = useState({ show: false, image: '' });
    const [msgModal, setMsgModal] = useState({show: false, title: "File error", message: "File type not supported."})

    const handleSelectImage = (event, id) => {
        const input = event.target;
        const file = input.files[0];
        if (isFileValid(file)) {
            showThumbnail(file, setPhotos);
        } else {
            setMsgModal(s => ({
                ...s,
                show: true,
                message: "File not valid"
            }))
        }
    }
    
    return ( 
        <div className="msg-col">
            <Row className="chat-header justify-content-between border-bottom py-3">
                <Col md={4}>
                    <div className="d-flex justify-content-start">
                        <img width="35" height="35" className="rounded-pill border" src={headerImage} alt="contact" />
                        <div className="ms-2">
                            <div className="chat-name">John Momoh</div>
                            <div className="last-msg">{ status ? "Active Now" : "Offline"}</div>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="d-flex justify-content-between">
                        <div className="header-icons-div" title="voice call">
                            <Icon className="text-secondary header-icons" icon="fluent:call-48-filled" />
                        </div>
                        <div className="header-icons-div" title="video call">
                            <Icon className="text-secondary header-icons" icon="wpf:video-call" />
                        </div>
                        <div className="header-icons-div" title="info">
                            <Icon className="text-secondary header-icons" icon="ant-design:info-circle-filled" />
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="inside">
                 <div className="chat-div py-3">
                    {
                        messages.map((msg, i) => <Message key={i} {...msg} setViewImage={setViewImage} />)
                    }
                </div>
            </div>
            <div className="write-div d-flex align-items-center justify-content-between bg-light border">
                <input onChange={handleSelectImage} type="file" name="at-files" className="d-none" id="at-files"
                    accept="image/jpg, image/png, image/jpeg" />
                <div className="right">
                    <label htmlFor="at-files" className="me-2  d-flex align-items-center">
                        <Icon icon="ooui:attachment" className="write-icon" title="attach files" />
                    </label>
                    <input className="msg-input" type='text' name="text" placeholder="Type message..." />
                </div>
                <Icon icon="bxs:microphone" title="record" className="write-icon" />
            </div>
            <MessageModal obj={msgModal} setShow={setMsgModal} />
            <ImageModal obj={viewImage} setShow={setViewImage} />
        </div>
     );
}

const messages = [
    {
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: headerImage,
        time: new Date()
    },{
        text: ".",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },{
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: headerImage,
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },{
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },{
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },{
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },{
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },{
        text: "okay i heard your",
        sender: "1",
        receiver: '535',
        image: "",
        time: new Date()
    },
    {
        text: "okay i heard your",
        sender: "3535",
        receiver: '1',
        image: "",
        time: new Date()
    },
];
 
export default Chat;