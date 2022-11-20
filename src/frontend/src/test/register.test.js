import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from 'react-router-dom';
import Register from '../components/register';

const MockRegister = () => {
    return (
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    )
}

it("register and login buttons are present", async () => {
    render(<MockRegister />)
    
    const registerButton = screen.getByText(/register/i);
    expect(registerButton).toBeInTheDocument();

    const loginLink = screen.getByText(/login/i)
    expect(loginLink).toBeInTheDocument();

})

it("should change text when button clicked", async () => {
    render(<MockRegister />)

    const registerButton = screen.getByText(/register/i);
    console.log(registerButton)
    expect(registerButton).toBeInTheDocument();

    fireEvent.click(registerButton);
    
    expect(registerButton.textContent).toEqual("Register");

})

it("should fill input", async () => {
    render( <MockRegister />)

    const number = "+2342527957235";
    const passInput = screen.getByPlaceholderText(/enter password/i);
    userEvent.type(passInput, number)
    expect(passInput.value).toEqual(number);
})

it("should fill and submit", async () => {
    render(<MockRegister />)
    
    const number = "+2342527957235";
    const numberInput = screen.getByPlaceholderText(/enter phone number/i);
    const passInput = screen.getByPlaceholderText(/enter password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm password/i);

    userEvent.type(passInput, number)
    userEvent.type(numberInput, number)
    userEvent.type(confirmInput, number)
    
    const registerButton = screen.getByText(/register/i);

    fireEvent.click(registerButton);

    
    expect(registerButton.textContent).not.toEqual("Register");
})

