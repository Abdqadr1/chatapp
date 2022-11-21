import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/login';
import axios from "axios";

jest.mock("axios");

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const MockLogin = () => {
    return (
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
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
    axios.post.mockResolvedValue({ data: { access_token: "tokes", phoneNumber: "number" } });
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

test("mock request", () => {
    axios.post.mockResolvedValue({ data: { access_token: "tokes", phoneNumber: "number" } });

    render(<MockLogin />)

    
    const number = "+2342527957235";
    const numberInput = screen.getByPlaceholderText("phonenumber");
    const passInput = screen.getByPlaceholderText("phonenumber");

    userEvent.type(numberInput, number);
    userEvent.type(passInput, "password");
    
    const loginButton = screen.getByText("Log In")
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    
    expect(loginButton.textContent).not.toEqual("Log In");
    
})