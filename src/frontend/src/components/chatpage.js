import axios from "axios";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router";
import Chat from "./chat";
import ContactInfo from "./contact-info";
import Contacts from "./contacts";
import { StompSessionProvider, useSubscription, useStompClient } from "react-stomp-hooks";
import { addMessage, getConversationFromStorage, setConversationToStorage, updateSentMessage } from "./utilities";
import uuid from 'react-uuid';

const ChatPage = ({ url, auth } ) => {
    const [currentChat, setCurrentChat] = useState({});
    const [timer, setTimer] = useState();
    const [abortRef] = [useRef()];
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const navigate = useNavigate();

    const stompClient = useStompClient();

    const uploadPhoto = (image, file, send) => {
        const data = new FormData();
        data.append("image", file);
        axios.put(`${url}/api/upload-photos/${auth.phoneNumber}`, data,
            { signal: abortRef?.current.signal })
            .then(res => {
                send(res.data);
            })
            .catch(() => alert("could not upload photo"));
    }

    const publishMessage = (msg, id) => {
        try {
            stompClient.publish({
                destination: `/app/chat/${id}`, body: JSON.stringify(msg)
            });
            addMessage(auth.phoneNumber, {...msg, id}, currentChat.phoneNumber);
            let [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
            listContacts(allContacts);
        } catch (e) {
            console.info(e);
        }
    }

    const sendMessage = (msg, file) => {
        const id = uuid();
        if (msg?.image) {
            setMessages(s => ([...s, { ...msg, id, progress: 1}]));
            uploadPhoto(msg.image, file, (imageName) => {
                msg.image = imageName;
                msg.photo = imageName;
                publishMessage(msg);
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
                key: c.key,
                last_msg: c?.last_msg || 'image',
                name: c?.name || c.key,
                unread: 0,
                phoneNumber: c.key,
                image: ""
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
                phoneNumber: c.key,
                image: ""
            })
        })
        setContacts(list);
    }
    useLayoutEffect(() => {
        if (!auth?.access_token || !auth?.phoneNumber) navigate("/login");
        let [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        listContacts(allContacts);
    }, [])

    const [receiveDest, sentDest] = [`/topic/messages/${auth.phoneNumber}`, `/topic/sent/${auth.phoneNumber}`]
    useSubscription([sentDest, receiveDest], (msg) => {
        const obj = JSON.parse(msg.body);
        const [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        const destination = msg.headers.destination;
        if (destination === sentDest) {
            updateSentMessage(auth.phoneNumber, obj);
            if (currentChat.phoneNumber === obj.receiver) {
                setMessages(s => {
                    const index = s.findIndex(c => c.id === obj.key);
                    if (index > -1) {
                        const old = s[index];
                        console.log(obj)
                        s[index] = { ...old, ...obj };
                        console.log({ ...old, ...obj });
                    }
                    return  [...s]
                })
            }
            
            return;
        }
        addMessage(auth.phoneNumber, obj, obj.sender);
        if (obj.sender === currentChat.phoneNumber) {
            setMessages(s => ([...s, obj]))
        }
        listContacts(allContacts);
    });

    useEffect(() => {
        abortRef.current = new AbortController();
        if (currentChat.phoneNumber) {
            clearInterval(timer);
            const time = setInterval(() => {
                axios.get(`${url}/api/get-contact-status/${auth.phoneNumber}/${currentChat.phoneNumber}`,
                    { signal: abortRef?.current.signal })
                    .then(res => {
                        setConnectionStatus(res.data?.status);
                    })
                    .catch(() => console.log("could not fetch user status"));
            }, 5000);
            setTimer(time);
        }
        return () => {
            clearInterval(timer);
            abortRef.current.abort();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat.phoneNumber]);



    useEffect(() => {
        console.log("fetching conversation...");
        if (!auth?.phoneNumber || !currentChat?.phoneNumber) return;
        let [, oldMessages] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        axios.get(`${url}/api/get-messages/${auth.phoneNumber}/${currentChat.phoneNumber}`, { signal: abortRef?.current.signal })
            .then(res => {
                console.log(res.data);
                let lastMsg = "";
                res.data.forEach(msg => {
                    let index = oldMessages.findIndex(e => e.id === msg.id)
                    if (index > -1) {
                        oldMessages[index] = msg;
                        return;
                    }
                    oldMessages.push(msg);
                    lastMsg = msg?.text || 'image';
                });
                setConversationToStorage(auth.phoneNumber, currentChat.phoneNumber, oldMessages);
                setMessages(oldMessages);
                let find = contacts.find(c => c.phoneNumber === currentChat.phoneNumber);
                if (find && lastMsg) {
                    find.last_msg = lastMsg;
                    setContacts(s => ([...s]));
                }
            })
            .catch(() => {
                setMessages(oldMessages);
                console.log("could not fetch conversation")
            })
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[abortRef, auth.phoneNumber, currentChat.phoneNumber, url])

    // get messages here
    
    if (!auth?.access_token || !auth?.phoneNumber) return <Navigate to="/login" />;
    return ( 
        <div className="chat-page-container">
                <Row className="justify-content-center chat-row">
                    <Col sm="3" className="border chat-col px-0">
                        <Contacts setCurrentChat={setCurrentChat} contacts={contacts}
                            setContacts={setContacts} auth={auth} searchContact={searchContact} />
                    </Col>
                    <Col sm="6" className="border chat-col">
                        <Chat auth={auth} contact={currentChat} messages={messages}
                            setMessages={setMessages} connectionStatus={connectionStatus} sendMessage={sendMessage} />
                    </Col>
                    <Col sm="3" className="border chat-col px-0">
                        <ContactInfo currentChat={currentChat} />
                    </Col>
                </Row>
        </div>
     );
}

const StompWrapper = ()  => {
    const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
    const socketUrl = process.env.REACT_APP_SOCKET_URL;
    const serverUrl = process.env.REACT_APP_SERVER_URL;


    useLayoutEffect(() => {
        const abortController = new AbortController();
        // TODO: get all messages

        return () => abortController.abort();

    }, []);

    return (
        <StompSessionProvider url={socketUrl + "/ws"} connectHeaders={{ "Authorization": "Bearer ..." }} connectionTimeout={5000}
            debug={(str) => { console.log(str)}}
            >
                <ChatPage url={socketUrl} auth={auth} />
        </StompSessionProvider>
    )
}
 
export default StompWrapper;