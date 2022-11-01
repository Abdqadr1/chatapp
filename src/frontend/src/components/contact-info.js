
import { Icon } from "@iconify/react";
import { Accordion, Col, Row } from "react-bootstrap";
import headerImage from "../images/male-av.png";
import "../styles/info.css";
import { downloadFile } from "./utilities";
import { useState } from "react";
import ImageModal from "./image-modal";
const ContactInfo = () => {
    const [images, setImages] = useState([...imageArray])
    const [files, setFiles] = useState([...fileArray]);
    const [viewImage, setViewImage] = useState({ show: false, image: '' });

    const handleClick = e => {
        setViewImage(s => ({
            ...s,
            show: true,
            image: headerImage
        }))
    }

    return ( 
        <div className="">
            <div className="p-3 border-bottom">
                <img src={headerImage} alt="contact" className="info-image" onClick={handleClick} />
                <div className="contact-name">James Momoh</div>
                <div className="contact-status">Active Now</div> 
            </div>
            <div className="p-3 media-div">
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className="ac-header">Shared Images</Accordion.Header>
                        <Accordion.Body className="ac-body">
                            <Row>
                                {
                                    images.map((img, i) => <ImageElement key={i} image={img} setImages={setImages} />)
                                }
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header className="ac-header">Shared Files</Accordion.Header>
                        <Accordion.Body className="ac-body">
                            {
                                files.map((f, i) => <FileElement key={i} file={f} setFiles={setFiles} />)
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                    </Accordion>
            </div>
            <div className="block-div">
                
            </div>
            <ImageModal obj={viewImage} setShow={setViewImage} />
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
const FileElement = ({ file, setFiles }) => {
    const { name, source, isDownloaded } = file;
    const download = e => {
        console.log("downloading file ...");
        downloadFile(source, 'png', (data) => {
            file.isDownloaded = true;
            setFiles(s => [...s]);
        });
    }
    
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
            {
                isDownloaded ? '' :
                <div className="p-1 bg-light rounded-pill download-div" title="download" onClick={download} >
                    <Icon icon="ci:download" />
                </div>
            }
        </div>
    );
};

const ImageElement = ({ image, setImages }) => {
    const { source, isDownloaded } = image;
    const downloadImage = e => {
        console.log("downloading image ...")
        downloadFile(source, 'png', (data) => {
            image.isDownloaded = true;
            setImages(s => [...s]);
        });
    }
    return (
        <Col sm={4} className="image-el-col">
            <img src={source} alt={source} />
            {
                isDownloaded ? "" : 
                <div className="download-div" title="download" onClick={downloadImage} >
                    <Icon icon="ci:download" />
                </div>
            }
        </Col>
    )
}

const fileArray = [
    {
        name: "resume.pdf",
        source: headerImage,
        isDownloaded: false
    },
    {
        name: 'design.doc',
        source: headerImage,
        isDownloaded: false
    }
    , {
        name: 'project.txt',
        source: headerImage,
        isDownloaded: false
    }
]
const imageArray = [
    {
        source: headerImage,
        isDownloaded: false
    },
    {
        source: headerImage,
        isDownloaded: false
    },
    {
        source: headerImage,
        isDownloaded: false
    }
]
 
export default ContactInfo;