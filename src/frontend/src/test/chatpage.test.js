import { screen, render, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from "react-router";
import { StompWrapper } from "../components/chatpage";
import '@testing-library/jest-dom/extend-expect'


jest.mock("axios");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const MockChatPage = () => {
    return (
        <MemoryRouter initialEntries={["/chat"]} >
            <StompWrapper />
        </MemoryRouter>
    )
}

beforeAll(() => {
    sessionStorage.setItem("auth", JSON.stringify({access_token: "tokens", phoneNumber: "number"}))
})

beforeEach(() => {
    Element.prototype.scroll = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
})

afterAll(() => {
    sessionStorage.clear();
    cleanup();
})

const countriesResponse = [
    {callCode: "india", code: "IN"}
] 


describe("static tests", () => {
    jest.useFakeTimers();

    test('should contain', async () => { 
        try {
            
            axios.get.mockImplementation((url) => {
                if (url.includes("get-user-messages") || url.includes("get-messages")) {
                    return Promise.resolve({
                        data: [{
                            sender: "sender",
                            receiver: "number",
                            text: "text message",
                            status: "SENT",
                            date: new Date().toDateString()
                    }] })
                }
                if (url.includes("get-contact-status")) {
                    return Promise.resolve({
                        data: { name: "test name", phoneNumber: "number", photo: "", status: true }
                    })
                }
                if (url.includes("country")) {
                    return Promise.resolve({
                        data: countriesResponse
                    })
                }
            })

            // render(<MockChatPage />)

            // const loader = screen.getByTestId(/loader/i);
            // expect(loader).toBeInTheDocument();

            // await waitFor(() => {
            //     expect(loader).not.toBeInTheDocument();
            // })
        } catch (err) {
            console.log(err)
        }

     })

})