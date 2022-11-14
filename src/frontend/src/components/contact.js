import axios from "axios";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import profileIMage from "../images/female-av.png";
import { getAllConversation, getShortName, saveAllConversation } from "./utilities";

const Contact = ({ obj, setCurrentChat, current, auth, setContacts }) => {
  const { name, last_msg, imagePath, phoneNumber } = obj;
  const img = imagePath ? imagePath : profileIMage;
  const url = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (!auth.phoneNumber) return;
    const abortController = new AbortController();
    axios.get(`${url}/get-contact-status/${auth.phoneNumber}/${phoneNumber}`,
      { signal: abortController.signal })
      .then(res => {
        console.log(res.data);
        setContacts(s => {
          const idx = s.findIndex(c => c.phoneNumber === phoneNumber);
          if (idx > -1) s[idx] = { ...s[idx], ...res.data };
          console.log(allMsgs);
          return [...s];
        });
        const allMsgs = getAllConversation(auth.phoneNumber);
        const idx = allMsgs.findIndex(c => c.key === phoneNumber);
        if (idx > -1) {
          allMsgs[idx] = { ...allMsgs[idx], ...res.data };
          saveAllConversation(auth.phoneNumber, allMsgs);
        }
      })
      .catch(() => console.log("could not fetch user status"));

    return () => abortController.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
      if (!current?.phoneNumber ||
        current.phoneNumber !== phoneNumber
    ) setCurrentChat({ ...obj })
  }

    return (
          <Row className="justify-content-between py-2 border-bottom mx-0 contact" onClick={handleClick}>
            <Col sm="2">
              <img width="35" height="35" className="rounded-pill border" src={img} alt="contact" />
            </Col>
            <Col sm="10">
                <div className="chat-name">{getShortName(name, 30)}</div>
                <div className="last-msg">{getShortName(last_msg, 30)}</div>
            </Col>
            {/* <Col sm="2" className="px-0 d-flex align-items-center">
              {(unread && unread > 0) ? <Badge className="rounded-pill unread-badge" bg="warning">{unread}</Badge> : ""}
            </Col> */}
          </Row>
      );
}
 
export default Contact;