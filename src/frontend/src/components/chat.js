import { Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react"; 
import "../styles/chat.css";
import headerImage from "../images/male-av.png";
import Message from "./message";
import { getShortName, isFileValid, scrollToBottom, showThumbnail } from "./utilities";
import { useEffect, useRef, useState } from "react";
import MessageModal from "./message_modal";
import ImageModal from "./image-modal";
import SendFileModal from "./sendfile";
import AudioModal from "./audio-modal";
const Chat = ({ auth, contact, messages, sendMessage: send, connectionStatus }) => {
    const { name, image, phoneNumber } = contact;
    const { access_token, phoneNumber: myPhoneNumber } = auth;
    const [viewImage, setViewImage] = useState({ show: false, image: '' });
    const [msgModal, setMsgModal] = useState({ show: false, title: "File error", message: "File type not supported." });
    const [photoModal, setPhotoModal] = useState({ show: false, image: '' });
    const [audioModal, setAudioModal] = useState({ show: false});
    const [isMessage, setIsMessage] = useState(false);
    const [inputRef] = [useRef()]
    const elId = "chatDiv";
    const imageAcceptArray = ["image/png", "image/jpg", "image/jpeg"];
    const docAcceptArray = ["application", "text/plain"];

    const handleSelectImage = (event) => {
        if (!phoneNumber) {
            event.preventDefault();
            return;
        }
        const input = event.target;
        const file = input.files[0];
        const checkValid = isFileValid(file, imageAcceptArray);
        if (checkValid.validity) {
            showThumbnail(file, (data) => {
                setPhotoModal(s=> ({...s, show: true, image: data, file}))
            });
        } else {
            setMsgModal(s => ({
                ...s,show: true,
                message: checkValid.message
            }))
        }
    }
    const handleSelectDoc = event => {
         if (!phoneNumber) {
            event.preventDefault();
            return;
        }
        const input = event.target;
        const file = input.files[0];
        const checkValid = isFileValid(file, docAcceptArray);
        if (checkValid.validity) {
            const msg = {
                type: "doc",
                text: "",
                sender: myPhoneNumber,
                receiver: phoneNumber,
                image: "",
                time: new Date(),
                status: "PENDING",
                doc: file,
            }
            send(msg, file);
        } else {
            setMsgModal(s => ({
                ...s,show: true,
                message: checkValid.message
            }))
        }
    }

    useEffect(() => {
        scrollToBottom(elId);
    }, [messages])

    const sendMessage = (messageFromModal, file={}) => {
        const mod = file ? messageFromModal : {};
        const msg = {
            text: inputRef?.current?.value || "",
            sender: myPhoneNumber,
            receiver: phoneNumber,
            image: "",
            time: new Date(),
            status: "PENDING",
            ...mod
        }
        send(msg, file);
        inputRef.current.value = "";
        setIsMessage(false);
    }

    const sendTheMessage = e => {
        if (!phoneNumber) {
            e.preventDefault();
            return;
        }
        if (e.keyCode === 13 && e.target.value !== "") sendMessage();
    }

    const changeIcon = e => {
        if (e.target.value !== "") setIsMessage(true);
        if (e.target.value === "") setIsMessage(false);
    }

    const record = e => {
        if (contact.phoneNumber) {
            setAudioModal(s => ({ ...s, show: true }));
        }
    }


    return ( 
        <div className="msg-col">
            <Row className="chat-header justify-content-between border-bottom py-3">
                <Col md={8}>
                    <div className="d-flex justify-content-start">
                        <img width="35" height="35" className="rounded-pill border" src={image || headerImage} alt="contact" />
                        <div className="ms-2">
                            <div className="chat-name">{getShortName(name, 40)}</div>
                            <div className="last-msg">{ connectionStatus ? "Active Now" : "Offline"}</div>
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
                 <div className="chat-div py-3" id={elId}>
                    {
                        messages.length > 0 ?
                            messages.map(msg => <Message key={msg.id} userPhone={myPhoneNumber} {...msg} setViewImage={setViewImage} />) :
                        <div className="text-center mt-4"><small>No message found. Start conversation</small></div>
                    }
                </div>
            </div>
            <div className="write-div d-flex align-items-center justify-content-between bg-light border">
                <input onChange={handleSelectImage} type="file" className="d-none" id="at-images"
                    accept="image/jpg, image/png, image/jpeg" />

                <input onChange={handleSelectDoc} type="file" className="d-none" id="at-documents"
                    accept="*" />

                <div className="right">
                    <div className="file-drop">
                        <Icon icon="ooui:attachment" className="write-icon" title="attach files" />
                        <div className="attach-dropdown">
                            <label htmlFor="at-images" className="files-label bg-danger text-light" title="Images">
                                <Icon icon="bi:images" />
                            </label>
                            <label htmlFor="at-documents" className="files-label bg-info text-danger" title="Documents">
                                <Icon icon="akar-icons:file" />
                            </label>
                        </div>
                    </div>
                    <input ref={inputRef} className="msg-input" type='text' name="text" placeholder="Type message..."
                        onInput={changeIcon} onKeyDown={sendTheMessage} />
                </div>
                {
                    isMessage ? <Icon icon="akar-icons:send" title="send" className="write-icon" onClick={()=> sendMessage()} /> :

                        <Icon icon="bxs:microphone" title="record" className="write-icon"
                            onClick={record} />
                }
            </div>
            <MessageModal obj={msgModal} setShow={setMsgModal} />
            <ImageModal obj={viewImage} setShow={setViewImage} />
            <SendFileModal obj={photoModal} setShow={setPhotoModal} sendMessage={sendMessage} />
            <AudioModal obj={audioModal} setShow={setAudioModal} sendMessage={sendMessage} />
        </div>
     );
}
 
export default Chat;