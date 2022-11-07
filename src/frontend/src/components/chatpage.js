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
const ChatPage = ({ connectionStatus, url, auth } ) => {
    const [currentChat, setCurrentChat] = useState({});
    const [timer, setTimer] = useState();
    const [abortRef] = [useRef()];
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    const stompClient = useStompClient();

    const sendMessage = (msg) => {
        const id = uuid();
        try {
            stompClient.publish({
                destination: `/app/chat/${id}`, body: JSON.stringify(msg)
            });
            msg.id = id;
            addMessage(auth.phoneNumber, msg, currentChat.phoneNumber);
            let [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
            listContacts(allContacts);
        } catch (e) {
            console.info(e);
        }
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

    useLayoutEffect(() => {
        if (!auth?.access_token || !auth?.phoneNumber) navigate("/login");
        let [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        listContacts(allContacts);
    }, [])

    const [receiveDest, sentDest] = [`/topic/messages/${auth.phoneNumber}`, `/topic/sent/${auth.phoneNumber}`]
    useSubscription([sentDest, receiveDest], (msg) => {
        const obj = JSON.parse(msg.body);
        console.log(obj);
        const [allContacts, ] = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
        const destination = msg.headers.destination;
        if (destination === sentDest) {
            updateSentMessage(auth.phoneNumber, msg);
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
                axios.get(`${url}/api/get-contact-status/${currentChat.phoneNumber}`, { signal: abortRef?.current.signal })
                    .then(res => {
                        setCurrentChat(s => ({ ...s, ...res.data }));
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
                            setContacts={setContacts} auth={auth} />
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
                <ChatPage connectionStatus={"connectionStatus"} url={socketUrl} auth={auth} />
        </StompSessionProvider>
    )
}
 
export default StompWrapper;