import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";

const AudioModal = ({ sendMessage, obj, setShow, myPhoneNumber, phoneNumber }) => {
    const hideModal = () => setShow(s => ({ ...s, show: false }));

    const sendMsg = (audio) => {
        const msg = {
            sender: myPhoneNumber,
            receiver: phoneNumber,
            image: "",
            time: new Date(),
            status: "PENDING",
            type: "audio",
            text: "",
            wav: audio,
            fileName: new Date().toTimeString()+".wav"
        }
        sendMessage(msg, audio);
        hideModal();
    }
    

    const handleAudioData = (stream, btn) => {
        const options = { mimeType: 'audio/webm' };
        const recordChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener('dataavailable', e => {
            if (e.data.size > 0) recordChunks.push(e.data);
        })

        mediaRecorder.addEventListener('stop', e => {
            const blob = new Blob(recordChunks, {type: options.mimeType}); 
            console.log(recordChunks, blob);
            sendMsg(blob);
        })
        btn.addEventListener('click', e => { mediaRecorder.stop();})

        mediaRecorder.start();
    }

    useEffect(() => {
        if (obj.show) {
            const btn = document.querySelector("#stopRecordBtn");
            navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                .then(str => handleAudioData(str, btn))
                .catch((err) => console.log("Needs microphone permission", err));
        }

    }, [obj.show]);

    return ( 
        <Modal show={obj.show} onHide={hideModal}>
            <Modal.Header closeButton className="py-2 fs-6">Audio Recording</Modal.Header>
            <Modal.Body className="text-center pt-0">
                <div className="d-flex justify-content-center border-bottom align-items-center" style={{height: "100px"}}>
                    <div className="recorder-div">
                        <div className="recorder1-div">
                            <Icon icon="bxs:microphone" className="fs-4" />
                        </div>
                    </div>
                </div>
                
                <div className="d-flex justify-content-end px-3 mt-3">
                    <div className="bg-success text-white rounded-pill fs-6" title="stop and send recording"
                        id="stopRecordBtn" style={{width: "40px", height: "40px"}} >
                        <Icon icon="akar-icons:send" className="mt-2" />
                    </div>
                </div>
                
            </Modal.Body>
        </Modal>
     );
}
 
export default AudioModal;