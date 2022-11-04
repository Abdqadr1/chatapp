import { Alert, Button, Form } from "react-bootstrap";
import { listFormData, SPINNERS_BORDER_HTML } from "./utilities";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";


const Login = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show });
    const [abortRef, alertRef] = [useRef(), useRef()];
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    useEffect(() => {
        abortRef.current = new AbortController();
        return () => abortRef.current.abort();
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        const target = e.target;
        const btn = target.querySelector("button[type='submit']");
        const txt = btn.textContent;
        const data = new FormData(target);
        btn.innerHTML = SPINNERS_BORDER_HTML;
        listFormData(data);
        const url = `${serverUrl}/auth`;
        axios.post(url, data, { signal: abortRef?.current.signal })
            .then(res => {
                sessionStorage.setItem("auth", JSON.stringify(res.data));
                navigate("/chat");
            })
            .catch(err => {
                console.log(err)
                setAlert(s => ({ ...s, show: true, message: err?.response?.data.message || "An error occurs" }))
            })
            .finally(() => {
                btn.textContent = txt;
            });
    }

    return ( 
        <div className="d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <Form onSubmit={handleSubmit} className="border rounded px-3 py-4" style={{width: "40vw"}} >
                <p className="text-center fw-bold">Log In</p>
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form.Control placeholder="phonenumber" name="phoneNumber" required minLength={10} maxLength={15} />

                <Form.Control  className="my-3" type="password" placeholder="password" name="password" required minLength={8} maxLength={100} />
                <Button className="mt-2 w-100" type="submit" variant="success">Log In </Button>
            </Form>
        </div>
     );
}
 
export default Login;