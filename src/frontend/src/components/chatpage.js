import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Navigate } from "react-router";
import Chat from "./chat";
import ContactInfo from "./contact-info";
import Contacts from "./contacts";
import { contactArray } from "./dummy";
import { StompSessionProvider, useSubscription, useStompClient } from "react-stomp-hooks";
import { getConversationFromStorage, setConversationToStorage } from "./utilities";
const ChatPage = ({ connectionStatus, url } ) => {
    const [currentChat, setCurrentChat] = useState({});
    const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
    const [timer, setTimer] = useState();
    const [abortRef] = [useRef()];
    const [contacts, setContacts] = useState([...contactArray]);
    const [messages, setMessages] = useState([]);

    const stompClient = useStompClient();

    const sendMessage = (msg) => {
        try {
            stompClient.publish({
                destination: `/app/chat/${currentChat.phoneNumber}`, body: JSON.stringify(msg)
            });
            return true;
        } catch (e) {
            console.info(e);
            return false;
        }
    }

    useSubscription([`/topic/messages/${auth.phoneNumber}`], (msg) => {
        console.log(msg);
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
        if (!auth?.phoneNumber || !currentChat?.phoneNumber) return;
        let messages = getConversationFromStorage(auth.phoneNumber, currentChat.phoneNumber, auth.name);
         axios.get(`${url}/api/get-messages/${auth.phoneNumber}/${currentChat.phoneNumber}`, { signal: abortRef?.current.signal })
                .then(res => {
                    res.data.forEach(msg => {
                        let index = messages.findIndex(e => e.id === msg.id)
                        if (index > -1) {
                            messages[index] = msg;
                            return;
                        }
                        messages.push(msg);
                        setConversationToStorage(auth.phoneNumber, currentChat.phoneNumber, messages);
                    });
                })
            .catch(() => console.log("could not fetch conversation"));
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[abortRef, auth.phoneNumber, currentChat.phoneNumber, url])

    // get messages here
    
    if (!auth?.access_token || !auth?.phoneNumber) return <Navigate to="/login" />;
    return ( 
        <div className="chat-page-container">
                <Row className="justify-content-center chat-row">
                    <Col sm="3" className="border chat-col px-0">
                        <Contacts setCurrentChat={setCurrentChat} contacts={contacts}
                            setContacts={setContacts} />
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
    const url = process.env.REACT_APP_SOCKET_URL;
    return (
        <StompSessionProvider url={url + "/ws"} connectHeaders={{ "Authorization": "Bearer ..." }} connectionTimeout={5000}
            debug={(str) => { console.log(str)}}
            >
                <ChatPage connectionStatus={"connectionStatus"} url={url} />
        </StompSessionProvider>
    )
}
 
export default StompWrapper;