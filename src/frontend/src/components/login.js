import { Alert, Button, Form } from "react-bootstrap";
import { listFormData, SPINNERS_BORDER_HTML } from "./utilities";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef, useState } from "react";


const Login = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show });
    const [abortRef, alertRef] = [useRef(), useRef()];

    const handleSubmit = e => {
        e.preventDefault();
        const target = e.target;
        const btn = target.querySelector("button[type='submit']");
        const txt = btn.textContent;
        const data = new FormData(target);
        btn.innerHTML = SPINNERS_BORDER_HTML;
        listFormData(data);
        axios.post("http://localhost:8080/api/register", data, { signal: abortRef?.current.signal })
            .then(res => {
                console.log(res.data);
                navigate("/chat");

            })
            .catch(err => setAlert(s => ({...s, show:true, message:err?.response?.data.message || "An error occurs" })))
            .finally(() => {
                btn.textContent = txt;
            });
    }

    return ( 
      <div className="d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <Form onSubmit={handleSubmit} className="border rounded px-3 py-4">
                <p className="text-center fw-bold">Log In</p>
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form.Control style={{ width: '70%' }} placeholder="Enter phone number" name="phoneNumber" required minLength={10} maxLength={15} />

                <Form.Control  className="my-2" type="password" placeholder="Enter password" name="password" required minLength={8} maxLength={100} />
                <Form.Control className="my-2" type="password" placeholder="Confirm password" name="confirm" required minLength={8} maxLength={100} />
                <Button className="mt-2 w-100" type="submit" variant="success">Log In </Button>
            </Form>
        </div>
     );
}
 
export default Login;