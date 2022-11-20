import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/login';

const MockLogin = () => {
    return (
        <BrowserRouter>
            <Login/>
        </BrowserRouter>
    )
}

it("login and register buttons are present", async () => {
    render( <MockLogin />)

    const loginButton = screen.getByText("Log In")
    expect(loginButton).toBeInTheDocument();

    const registerButton = screen.getByText("register")
    expect(registerButton).toBeInTheDocument();
})

it("should fill input", async () => {
    render( <MockLogin />)

    const number = "+2342527957235";
    const numberInput = screen.getByPlaceholderText("phonenumber");
    fireEvent.change(numberInput, { target: {value: number} });
    expect(numberInput.value).toEqual(number);
})

it("should change text when button clicked", async () => {
    render(<MockLogin />)

    
    const loginButton = screen.getByText("Log In")
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    
    expect(loginButton.textContent).not.toEqual("Log In");

})

it("auth is null", async () => {
    render(<MockLogin />)

    expect(sessionStorage.getItem("auth")).toBeFalsy();

})