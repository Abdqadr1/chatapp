
import { Icon } from "@iconify/react";
import { Accordion, Col, Row } from "react-bootstrap";
import headerImage from "../images/male-av.png";
import "../styles/info.css"
const ContactInfo = () => {
    return ( 
        <div className="">
            <div className="p-3 border-bottom">
                <img src={headerImage} alt="contact" className="info-image" />
                <div className="contact-name">James Momoh</div>
                <div className="contact-status">Active Now</div> 
            </div>
            <div className="p-3 media-div">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className="ac-header">Shared Images</Accordion.Header>
                        <Accordion.Body className="ac-body">
                            <Row>
                                <ImageElement url={headerImage} />
                                <ImageElement url={headerImage} />
                                <ImageElement url={headerImage} />
                                <ImageElement url={headerImage} />
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header className="ac-header">Shared Files</Accordion.Header>
                        <Accordion.Body className="ac-body">
                            {
                                fileArray.map((f, i) => <FileElement key={i} name={f} />)
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
            </div>
            <div className="block-div">
                
            </div>
        </div>
     );
}

const obj = {
        txt: "bi:filetype-txt",
        pdf: "ant-design:file-pdf-filled",
        doc: "bxs:file-doc",
        docx: "bi:filetype-docx",
        csv: "bi:filetype-csv",
        audio: "dashicons:media-audio",
    }
const FileElement = ({ name, url }) => {
    
    const ext = name.substring(name.lastIndexOf('.') + 1);
    const path = obj?.[ext];
    const colours = ['text-danger', 'text-warning', 'text-primary', 'text-secondary']
    let col = colours[Math.floor(Math.random()*colours.length)];
    return (
        <div className="d-flex justify-content-between my-2">
            <div className="d-flex align-items-center">
                <Icon icon={path} className={"me-2 " + col} />
                <div>{name}</div>
            </div>
            <div className="p-1 bg-light rounded-pill download-div" title="download">
                <Icon icon="ci:download" />
            </div>
        </div>
    );
};

const ImageElement = ({ url }) => {
    return (
        <Col sm={4} className="image-el-col">
            <img src={url} alt={url} />
            <div className="download-div" title="download">
                <Icon icon="ci:download" />
            </div>
        </Col>
    )
}

const fileArray = [
    "resume.pdf", "design.doc", "project a.txt"
]
 
export default ContactInfo;