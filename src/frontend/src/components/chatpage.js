import axios from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router";
import Chat from "./chat";
import ContactInfo from "./contact-info";
import Contacts from "./contacts";
import { StompSessionProvider, useSubscription, useStompClient } from "react-stomp-hooks";
import { addMessage, getAllConversation, getConversationFromStorage, getLastMsg, isTokenExpired, setConversationToStorage, SPINNERS_BORDER, updateSentMessage } from "./utilities";
import uuid from 'react-uuid';
import UpdateModal from "./update-modal";

const ChatPage = ({ url, auth } ) => {
    const [currentChat, setCurrentChat] = useState({});
    const [updateInfo, setUpdateInfo] = useState({ show: false, info: {} })
    const [timer, setTimer] = useState();
    const [abortRef] = [useRef()];
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const navigate = useNavigate();

    const stompClient = useStompClient();

    const uploadFile = (name, id, file, send) => {
        const data = new FormData();
        data.append("file", file, name);
        axios.put(`${url}/api/upload-files`, data,
            {
                signal: abortRef?.current.signal,
                headers: {
                    Authorization: `Bearer ${auth.access_token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progressRef = document.querySelector(`.progress${id}`);
                    const percent = (progressEvent.loaded === progressEvent.total) ? 0
                        : Math.round(progressEvent.loaded * 100 / progressEvent.total);
                    progressRef.style.width = `${percent}%`;
                }
            })
            .then(res => send(res.data))
            .catch((err) => {
                isTokenExpired(err, () => navigate("/login"));
                console.error("could not upload file");
                setMessages(s => {
                    const find = s.find(c => c.id === id);
                    if (find) find.status = "REJECTED";
                    return [...s];
                })
            });
    }

    const publishMessage = (msg, id) => {
        try {
            stompClient.publish({
                destination: `/app/chat/${id}`,
                headers: {
                    priority: 9, 
                    Authorization: `Bearer ${auth.access_token}`
                },
                body: JSON.stringify({...msg, wav: "", image: "", doc: ""})
            });
            addMessage(auth.phoneNumber, {...msg, id}, currentChat.phoneNumber);
            let [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
            listContacts(allContacts);
        } catch (e) {
            isTokenExpired(e, () => navigate("/login"));
            console.info(e);
        }
    }

    const sendMessage = (msg, file) => {
        const id = uuid();
        if (msg?.image || msg?.wav || msg?.doc) {
            setMessages(s => ([...s, { ...msg, id }]));
            uploadFile(msg.fileName, id, file, (fileName) => {
                if (msg?.type === "image") msg.photo = fileName;
                if (msg?.type === "audio") msg.audio = fileName;
                if (msg?.type === "doc") msg.document = fileName;
                publishMessage(msg, id);
            });
            return;
        }
        setMessages(s => ([...s, { ...msg, id, }]));
        publishMessage(msg, id);
    }

    const listContacts = (allContacts) => {
        const list = [];
        allContacts.forEach(c => {
            list.push({
                bio: c?.bio || "",
                key: c.key,
                last_msg: c?.last_msg,
                name: c?.name || c.key,
                unread: 0,
                phoneNumber: c.key,
                imagePath: c?.imagePath || "",
            })
        })
        setContacts(list);
    }

    const searchContact = (text) => {
        const [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        const list = [];
        allContacts.filter(c => c.name.includes(text) || c.key.includes(text))
            .forEach(c => {
            list.push({
                key: c.key,
                last_msg: c?.last_msg || 'image',
                name: c?.name || c.key,
                unread: 0,
                bio: c?.bio || "",
                phoneNumber: c.key,
                imagePath: c?.imagePath || ""
            })
        })
        setContacts(list);
    }
    useLayoutEffect(() => {
        abortRef.current = new AbortController();
        if (!auth?.access_token || !auth?.phoneNumber) navigate("/login");
        let [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        listContacts(allContacts);
        axios.get(`${url}/api/get-contact-status/${auth.phoneNumber}/${auth.phoneNumber}`,
            {
                signal: abortRef?.current.signal,
                headers: {
                    Authorization: `Bearer ${auth.access_token}`
                }
            })
            .then(res => {
                console.log(res.data)
                setUpdateInfo(s => ({...s, info: {...res.data}}))
            })
            .catch((err) => {
                isTokenExpired(err, () => navigate("/login"));
                console.log("could not fetch user info")
            });
            
        return () => {
            clearInterval(timer);
            abortRef.current.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [receiveDest, sentDest] = [`/topic/messages/${auth.phoneNumber}`, `/topic/sent/${auth.phoneNumber}`]
    useSubscription([sentDest, receiveDest], (msg) => {
        const obj = JSON.parse(msg.body);
        const destination = msg.headers.destination;
        if (destination === sentDest) {
            updateSentMessage(auth.phoneNumber, obj);
            if (currentChat.phoneNumber === obj.receiver) {
                setMessages(s => {
                    const index = s.findIndex(c => c.id === obj.key);
                    if (index > -1) {
                        const old = s[index];
                        s[index] = { ...old, ...obj };
                        console.log({ ...old, ...obj });
                    }
                    return  [...s]
                })
            }
            
            return;
        }
        addMessage(auth.phoneNumber, obj, obj.sender);
        const [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        if (obj.sender === currentChat.phoneNumber) {
            setMessages(s => ([...s, obj]))
        }
        listContacts(allContacts);
    });

    useEffect(() => {
        const abortController = new AbortController();
        if (currentChat.phoneNumber) {
            const time = setInterval(() => {
                axios.get(`${url}/api/get-contact-status/${currentChat.phoneNumber}`,
                    {
                        signal: abortController.signal,
                        headers: {
                            Authorization: `Bearer ${auth.access_token}`
                        }
                    })
                    .then(res => {
                        setConnectionStatus(res.data?.status);
                    })
                    .catch(err => {
                        isTokenExpired(err, () => navigate("/login"));
                        console.log("could not fetch user status")
                    });
            }, 5000);
            setTimer(s => {
                clearInterval(s);
                return time;
            });
        }
        return () => abortController.abort();
    }, [auth.access_token, auth.phoneNumber, currentChat.phoneNumber, navigate, url]);

    useEffect(() => {
        console.log("fetching conversation...");
        if (!auth?.phoneNumber || !currentChat?.phoneNumber) return;
        const abortController = new AbortController();
        let [, oldMessages] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        axios.get(`${url}/api/get-messages/${currentChat.phoneNumber}`,
            {
                signal: abortController.signal,
                headers: {
                    Authorization: `Bearer ${auth.access_token}`
                }
            })
            .then(res => {
                console.log(res.data);
                let lastMsg = "";
                res.data.forEach(msg => {
                    let index = oldMessages.findIndex(e => e.id === msg.id);
                    if (index > -1) {
                        oldMessages[index] = msg;
                        return;
                    }
                    oldMessages.push(msg);
                    console.log(getLastMsg(msg))
                    lastMsg = getLastMsg(msg)
                });
                setConversationToStorage(auth.phoneNumber, currentChat.phoneNumber, oldMessages);
                setMessages(oldMessages);
                setContacts(s => {
                    let find = s.find(c => c.phoneNumber === currentChat.phoneNumber);
                    if (find && lastMsg) {
                        find.last_msg = lastMsg;
                    }
                    return [...s];
                });
            })
            .catch(err => {
                setMessages(oldMessages);
                isTokenExpired(err, () => navigate("/login"));
                console.log("could not fetch conversation")
            })
        return () => abortController.abort();
    },[auth.access_token, auth.name, auth.phoneNumber, currentChat.phoneNumber, navigate, url])

    
    if (!auth?.access_token || !auth?.phoneNumber) return <Navigate to="/login" />;
    const style = currentChat?.phoneNumber ? "" : "no-chat";
    return ( 
        <div className="chat-page-container">
            <Row className="justify-content-center chat-row">
                <Col sm="3" className="border chat-col px-0">
                    <Contacts setCurrentChat={setCurrentChat} currentChat={currentChat} contacts={contacts}
                        setContacts={setContacts} auth={auth} searchContact={searchContact} info={updateInfo.info}
                        setUpdateInfo={setUpdateInfo} />
                </Col>
                <Col sm="6" className={`border chat-col ${style}`}>
                    <Chat auth={auth} contact={currentChat} messages={messages}
                        setMessages={setMessages} connectionStatus={connectionStatus} sendMessage={sendMessage} />
                    <div className="cloud">select a chat.</div>
                </Col>
                <Col sm="3" className={`border px-0 chat-col ${style}`}>
                    <ContactInfo currentChat={currentChat} messages={messages} status={connectionStatus} />
                    <div className="cloud">select a chat.</div>
                </Col>
            </Row>
            <UpdateModal obj={updateInfo} setShow={setUpdateInfo} auth={auth} />
        </div>
     );
}

const StompWrapper = ()  => {
    const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
    const socketUrl = process.env.REACT_APP_SOCKET_URL;
    const [isReady, setReady] = useState(false);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const abortController = new AbortController();
        if (!auth.phoneNumber) return;
        const allMsgs = getAllConversation(auth.phoneNumber);
        axios.get(`${process.env.REACT_APP_SERVER_URL}/get-user-messages`,
            {
                signal: abortController.signal,
                headers: {
                    Authorization: `Bearer ${auth.access_token}`
                }
            })
            .then(res => {
                console.log(res.data);
                res.data.forEach(msg => {
                    let key = msg.receiver === auth.phoneNumber ? msg.sender : msg.receiver;
                    const fn = allMsgs.find(c => c.key === key);
                    const lastMsg = getLastMsg(msg)
                    if (fn) {
                        const idx = fn.messages.findIndex(m => m.id === msg.id);
                        if (idx > -1) {
                            fn.messages[idx] = { ...msg };
                            return;
                        }
                        fn.messages.push({ ...msg });
                        fn.last_msg = lastMsg
                        return;
                    }
                    const arr = { key, last_msg: lastMsg, messages: [{ ...msg }], name: "", photo: "" };
                    allMsgs.push(arr);
                });
                sessionStorage.setItem(auth.phoneNumber + "_messages", JSON.stringify(allMsgs));
            })
            .catch(err => {
                isTokenExpired(err, () => navigate("/login"));
                console.log("could not fetch user messages")
            })
            .finally(() => setReady(true));
        
        return () => abortController.abort();

    }, [auth.access_token, auth.phoneNumber, navigate]);

    return ( 
        <>
            {
                (isReady) ?
                    <StompSessionProvider url={socketUrl + "/ws"} connectionTimeout={5000}  debug={(str) => { console.log(str)}}
                        connectHeaders={{ 'Authorization': `Bearer ${auth.access_token}` }}
                        onStompError={err => {
                            console.log(err)
                            isTokenExpired(err, () => navigate("/login"))
                        }}
                    >
                        <ChatPage url={socketUrl} auth={auth} />
                </StompSessionProvider>
                : <div className="stomp-loader">{SPINNERS_BORDER}</div>
            }
        </>
    )
}
 
export default StompWrapper;