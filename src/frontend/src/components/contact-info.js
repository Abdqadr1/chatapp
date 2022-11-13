
import { Icon } from "@iconify/react";
import { Accordion, Col, Row } from "react-bootstrap";
import headerImage from "../images/male-av.png";
import "../styles/info.css";
import { downloadFile, fileTypeObj, getShortName } from "./utilities";
import { useEffect, useState } from "react";
import ImageModal from "./image-modal";
import { Link } from "react-router-dom";
const ContactInfo = ({ messages, status, currentChat }) => {
    const { name, image } = currentChat;
    const [images, setImages] = useState([])
    const [files, setFiles] = useState([]);
    const [viewImage, setViewImage] = useState({ show: false, image: '' });

    const handleClick = e => {
        setViewImage(s => ({
            ...s,
            show: true,
            image: headerImage
        }))
    }
    useEffect(() => {
        const imgs = [], files = [];
        messages.forEach(el => {
            if (el?.imagePath) {
                imgs.push({
                    name: el?.photo,
                    source: el.imagePath,
                    isDownloaded: true
                });
            }
            if (el?.audio || el?.document) {
                files.push({
                    name: el?.audio || el?.document,
                    source: el?.audioPath || el?.docPath
                });
            }
        });
        setImages(imgs);
        setFiles(files);
    }, [messages])
    

    return ( 
        <div className="">
            <div className="my-2 text-end pe-3">
                <small><Link className="text-decoration-none text-danger " to={"/logout"}>Logout</Link></small>
            </div>
            <div className="p-3 border-bottom">
                <img src={image || headerImage} alt="contact" className="info-image" onClick={handleClick} />
                <div className="contact-name">{name}</div>
                <div className="contact-status">{ status ? "Active Now" : "Offline Now" }</div> 
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


const FileElement = ({ file, setFiles }) => {
    const { name, source } = file;
    const download = e => {
        const link = document.createElement('a');
            link.href = source;
            link.setAttribute('download', name); //or any other extension
            link.setAttribute("target", "blank");
            document.body.appendChild(link);
            link.click();
            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
    }
    
    const ext = name.substring(name.lastIndexOf('.') + 1);
    const path = fileTypeObj?.[ext];
    const colours = ['text-danger', 'text-warning', 'text-primary', 'text-secondary']
    let col = colours[Math.floor(Math.random()*colours.length)];
    return (
        <div className="d-flex justify-content-between my-2">
            <div className="d-flex align-items-center">
                <Icon icon={path} className={"me-2 " + col} />
                <div>{getShortName(name.toLowerCase(), 15)}</div>
            </div>
            <div className="p-1 bg-light rounded-pill download-div" title="download" onClick={download} >
                <Icon icon="ci:download" />
            </div>
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
 
export default ContactInfo;