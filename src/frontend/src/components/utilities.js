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

export function isFileValid(file) {
    if (file.size > 1048576) {
        return false;
    }
    if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
        return false;
    }
    return true;
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


export const isTokenExpired = (response) => {
    if(response === null || response === undefined) return false;
    const message = response.data.message.toLowerCase()
    if (Number(response.status) === 400
        && message.indexOf("token") > -1
        && message.indexOf("expired") > -1) return true
    
    return false
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

export const addMessage = (myPhoneNumber, message, key) => {
    const messageKey = myPhoneNumber + "_messages";
    if (key) {
        const sender = message.sender;
        const allMsgs = JSON.parse(sessionStorage.getItem(messageKey));
        const fn = allMsgs.find(c => c.key === key);
        if (fn) {
            fn.messages.push(message);
            fn.last_msg = message?.text || 'image';
            sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
            return;
        }
        
        const arr = { key: sender, last_msg:message?.text || 'image', messages: [{...message}], name: "", photo: "" };
        allMsgs.push(arr);
        sessionStorage.setItem(messageKey, JSON.stringify(allMsgs));
    }
    
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
        fn.last_msg = messages[messages.length - 1]?.text || "image";
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