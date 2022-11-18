import { useRef, useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { listFormData, SPINNERS_BORDER_HTML } from "./utilities";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [countries, setCountries] = useState([]);
    const [form, setForm] = useState({ name: '',password: '', confirm: '', phoneNumber: ''})
    const [abortRef, alertRef] = [useRef(), useRef()];
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
    const navigate = useNavigate();
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    useEffect(() => {
        abortRef.current = new AbortController();
        axios.get('http://api-env.eba-irpspqyp.us-east-1.elasticbeanstalk.com/country/all',
            { signal: abortRef?.current.signal })
            .then(res => {
                setAlert(s => ({...s,  show: false}))
                setCountries(res.data)
            })
            .catch(() => setAlert({ show: true, message: "Could not fetch countries" }))
        return () => abortRef?.current.abort();
    }, [abortRef])
    const toggleAlert = () => setAlert({ ...alert, show: !alert.show });

    const handleInput = e => {
        setForm(s => ({
            ...s, 
            [e.target.name] : e.target.value
        }))
    }
    
    const handleSubmit = e => {
        e.preventDefault();
        const number = form.phoneNumber;
        if (!number.startsWith("+") || number.length < 10) {
            setAlert(s => ({ ...s, show: true, message: "Invalid phone number" }));
            return;
        }
        if (form.password !== form.confirm) {
            setAlert(s => ({ ...s, show: true, message: "Confirm your password" }));
            return;
        }
        const target = e.target;
        const btn = target.querySelector("button[type='submit']");
        const txt = btn.textContent;
        const data = new FormData(target);
        btn.innerHTML = SPINNERS_BORDER_HTML;
        listFormData(data);
        axios.post(`${serverUrl}/register`, data, { signal: abortRef?.current.signal })
            .then(res => {
                console.log(res.data);
                navigate("/login");
            })
            .catch(err => setAlert(s => ({...s, show:true, message:err?.response?.data.message || "An error occurs" })))
            .finally(() => {
                btn.textContent = txt;
            });
    }
    const changeCallCode = e => {
        console.log(e.target.value);
        setForm(s => ({...s, phoneNumber: e.target.value}))
    }
    
    return (  
        <div className="d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <Form onSubmit={handleSubmit} className="bod rounded px-3 py-4">
                <p className="text-center fw-bold">Register</p>
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form.Control value={form?.firstName} onInput={handleInput} className="me-1 my-2 bg-transparent border-secondary" placeholder="Enter name"
                    name="name" minLength={4} required maxLength={40} />
                 <div className="d-flex justify-content-between align-items-center my-2">
                    <Form.Select className=" bg-transparent border-secondary" style={{width: '28%'}} id="countrySelect" defaultValue={''} onChange={changeCallCode}>
                        <option value='' hidden>---</option>
                        {
                            countries.map(c => <option key={c.code} value={c.callCode}>{c.code} ({c.callCode})</option>)
                        }
                    </Form.Select>
                    <Form.Control className=" bg-transparent border-secondary" value={form?.phoneNumber} onInput={handleInput} style={{ width: '70%' }}
                        placeholder="Enter phone number" name="phoneNumber" required minLength={10} maxLength={15} />
                </div>

                <Form.Control value={form?.password} onInput={handleInput} className="my-2 bg-transparent border-secondary" type="password" placeholder="Enter password" 
                    name="password" required minLength={8} maxLength={100} />
                <Form.Control value={form?.confirm} onInput={handleInput} className="my-2 bg-transparent border-secondary" type="password" placeholder="Confirm password" 
                    name="confirm" required minLength={8} maxLength={100} />
                <Button className="mt-2 w-100" type="submit" variant="success">Register</Button>
                <div className="d-flex justify-content-end mt-2">
                    <Link className="text-decoration-none text-success fs-6" to={"/login"} >Login</Link>
                </div>
            </Form>
        </div>
    );
}
 
export default Register;