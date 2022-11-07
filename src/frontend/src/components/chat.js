import { Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react"; 
import "../styles/chat.css";
import headerImage from "../images/male-av.png";
import Message from "./message";
import { getShortName, isFileValid, scrollToBottom, showThumbnail } from "./utilities";
import { useEffect, useRef, useState } from "react";
import MessageModal from "./message_modal";
import ImageModal from "./image-modal";
const Chat = ({ auth, contact, messages, setMessages, sendMessage: send, connectionStatus }) => {
    const { name, image, status, phoneNumber } = contact;
    const { access_token, phoneNumber: myPhoneNumber } = auth;
    const [photos, setPhotos] = useState('');
    const [viewImage, setViewImage] = useState({ show: false, image: '' });
    const [msgModal, setMsgModal] = useState({ show: false, title: "File error", message: "File type not supported." });
    const [isMessage, setIsMessage] = useState(false);
    const [inputRef] = [useRef()]
    const elId = "chatDiv";

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

    useEffect(() => {
        scrollToBottom(elId);
    }, [messages])

    const sendMessage = () => {
        const msg = {
            text: inputRef?.current?.value || "",
            sender: myPhoneNumber,
            receiver: phoneNumber,
            image: "",
            time: new Date()
        }
        send(msg);
        setMessages(s => ([...s, msg]));
        inputRef.current.value = "";
        setIsMessage(false);
    }

    const sendTheMessage = e => {
        if (e.keyCode === 13 && e.target.value !== "") sendMessage();
    }

    const doMicrophone = e => {
        console.log("microphone....")
    }

    const changeIcon = e => {
        if (e.target.value !== "") setIsMessage(true);
        if (e.target.value === "") setIsMessage(false);
    }


    return ( 
        <div className="msg-col">
            <Row className="chat-header justify-content-between border-bottom py-3">
                <Col md={8}>
                    <div className="d-flex justify-content-start">
                        <img width="35" height="35" className="rounded-pill border" src={headerImage} alt="contact" />
                        <div className="ms-2">
                            <div className="chat-name">{getShortName(name, 40)}</div>
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
                {/* <Col md={12}> <small>{ connectionStatus }</small></Col> */}
            </Row>
            <div className="inside">
                 <div className="chat-div py-3" id={elId}>
                    {
                        messages.length > 0 ?
                            messages.map((msg, i) => <Message key={i} userPhone={myPhoneNumber} {...msg} setViewImage={setViewImage} />) :
                        <div className="text-center mt-4"><small>No message found. Start conversation</small></div>
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
                    <input ref={inputRef} className="msg-input" type='text' name="text" placeholder="Type message..."
                        onInput={changeIcon} onKeyDown={sendTheMessage} />
                </div>
                {
                    isMessage ? <Icon icon="akar-icons:send" title="send" className="write-icon" onClick={sendMessage} /> :

                    <Icon icon="bxs:microphone" title="record" className="write-icon" onClick={doMicrophone} />
                }
            </div>
            <MessageModal obj={msgModal} setShow={setMsgModal} />
            <ImageModal obj={viewImage} setShow={setViewImage} />
        </div>
     );
}
 
export default Chat;