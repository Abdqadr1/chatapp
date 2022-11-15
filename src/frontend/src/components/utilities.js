import axios from "axios";
import { Spinner } from "react-bootstrap";

export function showThumbnail(file, cb) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        cb(event.target.result);
    }
    fileReader.readAsDataURL(file);
}

export function listFormData(data){
    if(!process.env.NODE_ENV || process.env.NODE_ENV === "development"){
        for (const pair of data.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
    }
      
}

export function isFileValid(file, accept, size = 1048576) {
    const ret ={validity: true}
    if (file.size > size) {
        ret.validity = false;
        const maxSize = Number(size/1000).toFixed(2);
        ret.message = `File size is too large, max size is ${maxSize} KB`;
        return ret;
    }
    const findIndex = accept.findIndex(c => c === file.type || file.type.includes(c));
    ret.validity = findIndex > -1;
    ret.message = "File type not supported";
    return ret;
}

export const SPINNERS_BORDER = <Spinner animation="border" size="sm" className="d-block m-auto" style={{width: "4rem", height: "4rem"}} />
export const SPINNERS_GROW = <Spinner animation="grow" size="sm" />
export const SPINNERS_BORDER_HTML = `<div class="spinner-border spinner-border-sm text-dark" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SPINNERS_GROW_HTML = `<div class="spinner-grow spinner-grow-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`
export const SEARCH_ICON = `<i class="bi bi-search"></i>`;

export const isAuthValid = (auth) => {
    if (auth?.accessToken && auth?.id) return true
    
    return false
}


export const isTokenExpired = (err, cb) => {
    const res = err?.response;
    if (res === null || res === undefined) return;
    const message = res?.data?.message?.toLowerCase() || res?.data?.error?.toLowerCase();
    console.log(message);
    if (Number(res.status) === 406
        && message.indexOf("token") > -1
        && message.indexOf("expired") > -1) cb();
}

export const getShortName = (name, len=60) => {
    if(name && name.length > len){
        return name.substring(0,len) + "...";
    }
    return name;
}

export const downloadFile = (url, ext, cb) => {
     axios.get(url, {responseType: 'blob'}).then((res) => {

        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "x-suggested-filename";
        const suggestedFileName = res.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
                    ? url.substring(5)
                    : suggestedFileName);
        console.log(`Received header [${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName}`);

        // Let the user save the file.
         console.log(res.data);
         // create file link in browser's memory
        const href = URL.createObjectURL(res.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', effectiveFileName); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
         URL.revokeObjectURL(href);
         cb(res.data);

     })
         .catch((response) => {
            console.error("Could not Download the Excel report from the backend.", response);
        });
}

export function getLastMsg(message) {
    let icon = message?.text;
    if(message?.audioPath || message?.wav) icon = "audio file"
    if(message?.imagePath || message?.image) icon = "image file"
    if (message?.docPath || message?.doc) {
        const ext = message?.docPath ?
            message.docPath.substring(message.docPath.lastIndexOf('.') + 1)
            : message.doc.fileName.substring(message.doc.fileName.lastIndexOf('.') + 1); 
        // let ic = fileTypeObj?.[ext] || "akar-icons:file";
        // const colours = ['text-danger', 'text-warning', 'text-primary', 'text-secondary']
        // let col = colours[Math.floor(Math.random()*colours.length)];
        icon = `${ext} file`
    }
    return icon;
}

export const addMessage = (myPhoneNumber, message, key) => {
    const messageKey = myPhoneNumber + "_messages";
    const lastMsg = getLastMsg(message);
    if (key) {
        const allMsgs = JSON.parse(sessionStorage.getItem(messageKey));
        const fn = allMsgs.find(c => c.key === key);
        if (fn) {
            const idx = fn.messages.findIndex(m => m.id === message.id);
            if (idx > -1) {
                fn.messages[idx] = { ...message };
                sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
                return;
            }
            fn.messages.push(message);
            fn.last_msg = lastMsg
            sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
            return;
        }
        
        const arr = { key, last_msg:lastMsg, messages: [{...message}], name: "", photo: "" };
        allMsgs.push(arr);
        sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
    }
    
}
export const getAllConversation = (phoneNumber) => {
    const messageKey = phoneNumber + "_messages";
    if (sessionStorage.getItem(messageKey)) {
        return JSON.parse(sessionStorage.getItem(messageKey));
    }
    return [];
}
export const saveAllConversation = (phoneNumber, allMsgs) => {
    const messageKey = phoneNumber + "_messages";
    sessionStorage.setItem(messageKey, JSON.stringify(allMsgs))
}

export const getConversationFromStorage = (myPhoneNumber, toPhone, name) => {
        const messageKey = myPhoneNumber + "_messages";
        if (sessionStorage.getItem(messageKey)) {
            const allMsgs = JSON.parse(sessionStorage.getItem(messageKey));
            const fn = allMsgs.find(c => c.key === toPhone);
            if (fn) {
                return [allMsgs, fn.messages];
            } 
            return [allMsgs, []];
        } 
        const arr = toPhone ? [{ key: toPhone, name, photo: '', messages: [], last_msg: ""}] : [];
        sessionStorage.setItem(messageKey, JSON.stringify(arr));
        return [[], []];
    }

export const setConversationToStorage = (myPhoneNumber, toPhone, messages) => {
        const messageKey = myPhoneNumber + "_messages";
        const allMsgs = JSON.parse(sessionStorage.getItem(messageKey));
        const fn = allMsgs.find(c => c.key === toPhone);
        fn.messages = messages; 
        fn.last_msg = getLastMsg(messages[messages.length - 1]);
        sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
}

export const addContactToStorage = (myPhoneNumber, contact) => {
    const messageKey = myPhoneNumber + "_messages";
    const { phoneNumber, key, photo, name, last_msg } = contact;
    const allMsgs = JSON.parse(sessionStorage.getItem(messageKey));
    const fn = allMsgs.find(c => c.key === phoneNumber);
    if(fn){
        fn.name = name;
        fn.photo = photo;
        sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
        return;
    }
    allMsgs.push({ key, name, photo, messages: [], last_msg });
    sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
    
}

export const updateSentMessage = (myPhoneNumber, msg) => {
    const messageKey = myPhoneNumber + "_messages";
    const allMsgs = JSON.parse(sessionStorage.getItem(messageKey));
    const fn = allMsgs.find(c => c.key === msg.receiver);
    if (fn) {
        const index = fn.messages.findIndex(c => c.id === msg.key);
        if (index > -1) {
            const old = fn.messages[index];
            fn.messages[index] = { ...old, ...msg };
        }
        sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
        return;
    }
}

export const scrollToBottom = (id) => {
    const el = document.querySelector("#" + id);
    el.scrollIntoView({ behavior: "smooth", block: "end" });
}

export const fileTypeObj = {
        txt: "bi:filetype-txt",
        pdf: "ant-design:file-pdf-filled",
        doc: "bxs:file-doc",
        docx: "bi:filetype-docx",
        csv: "bi:filetype-csv",
        wav: "dashicons:media-audio",
}