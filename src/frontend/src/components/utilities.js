import axios from "axios";
import { Spinner } from "react-bootstrap";

export  function alterArrayEnable(allUser, id, status, callback){
    const user = allUser.find((u) => id === u.id);
    user.enabled = status;
    callback([...allUser])
}

export function alterArrayDelete(allUser, id, callback) {
    const newUsers = allUser.filter(user => user.id !== id)
    callback(newUsers)
}

export function alterArrayUpdate(user, callback) {
    callback([user])
}

export function alterArrayAdd(allUser, user, callback) {
    allUser.push(user)
    callback([...allUser])
}

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

export const getFormData = (form) => {
    return Object.keys(form).reduce((formData, key) => {
        if (key === 'roles') {
                formData.append(key, form[key].map(role => role.id ?? role))
        } else if(key === "product_images"){
            const productImages =  form[key];
            if(productImages.length > 0){
                form[key].forEach((f, i) => {
                    if(i === 0){
                        formData.append("image", f);
                    } else {
                        formData.append("extra_image", f);
                    }
                })
            }
            
        }else{ 
            formData.append(key, form[key]);
        }
        return formData
    }, new FormData());
}

export const isAuthValid = (auth) => {
    if (auth?.accessToken && auth?.id) return true
    
    return false
}

export const getAccessToken = () => {
    return JSON.parse(localStorage.getItem("user")).accessToken
}

export const isTokenExpired = (response) => {
    if(response === null || response === undefined) return false;
    const message = response.data.message.toLowerCase()
    if (Number(response.status) === 400
        && message.indexOf("token") > -1
        && message.indexOf("expired") > -1) return true
    
    return false
}

export const isInArray = (needle, haystack) => {
    for (let i = 0; i < haystack.length; i++){
        if(needle === haystack[i]) return true
    }
    return false
}

export function formatDate(date, dateStyle="short", timeStyle="short") {
    if (date) {
        const formatter = new Intl.DateTimeFormat("en-US", {dateStyle, timeStyle});
         return formatter.format(new Date(date))
    }
    return "";
}
 // eslint-disable-next-line no-unused-vars
 const formatDateForInput = (val, separator = "-") => {
        if (!val) return "";
        const parts = Intl.DateTimeFormat("en", { month: "2-digit", day: "2-digit", year: "numeric" }).formatToParts(new Date(val))
        const year = parts[4].value;
        const month = parts[0].value;
        const day = parts[2].value;
        const str = `${year}${separator}${month}${separator}${day}`;
        return str;
}

export const getShortName = (name, len=60) => {
    if(name.length > len){
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