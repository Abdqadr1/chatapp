import { useRef, useState, useEffect } from "react";
import { Alert, Form } from "react-bootstrap";
import axios from "axios";

const Register = () => {
    const [countries, setCountries] = useState([]);
    const [abortRef, alertRef] = [useRef(), useRef()];
    const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });

    useEffect(() => {
        abortRef.current = new AbortController();
        axios.get('http://api-env.eba-irpspqyp.us-east-1.elasticbeanstalk.com/country/all')
            .then(res => setCountries(res.data))
            .catch(() => setAlert({ show: true, message: "Could not fetch countries" }))
        return () => abortRef?.current.abort();
    }, [abortRef])

    const handleSubmit = e => {
        e.preventDefault();
        console.log(e.target);
    }
    
    const toggleAlert = () => {
        setAlert({...alert, show: !alert.show})
    }

    return (  
        <div className="d-flex align-items-center justify-content-center" style={{height: '100vh'}}>
            <Form onSubmit={handleSubmit}>
                <Alert ref={alertRef} tabIndex={-1} variant={alert.variant} show={alert.show} dismissible onClose={toggleAlert}>
                    {alert.message}
                </Alert>
                <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control placeholder="Enter first name" name="firstName" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
            </Form>
        </div>
    );
}
 
export default Register;