import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AddContactModal from "../../src/components/add-contact-modal";
import axios from "axios";


   // mocking axios request
    jest.mock("axios");

    afterEach(cleanup)

const MockAddModal = () => {
    return (
        <BrowserRouter>
            <AddContactModal obj={{show:true}} setShow={jest.fn()} auth={{access_token: "toks...", phoneNumber:"number"}} />
        </BrowserRouter>
    )
}

const countriesResponse = [
    {callCode: "india", code: "IN"}
] 

describe('AddContactModalTest', () => { 

    test('static text', async () => {

        axios.get.mockResolvedValue({data: countriesResponse });
        render(<MockAddModal />);

        const title = screen.getByText(/add new contact/i);
        expect(title).toBeInTheDocument();
        const addBtn = screen.getByText(/add contact/i);
        expect(addBtn).toBeInTheDocument();

        await waitFor(() => {
         expect(screen.getByTestId(/country-0/i).value).toBe(countriesResponse[0].callCode);
        });

    });

    test("should fill input", async () => {

        axios.get.mockResolvedValue({data: countriesResponse });
        render( <MockAddModal />)

        const number = "+2342527957235";
        const numberInput = screen.getByPlaceholderText("phone number");
        userEvent.type(numberInput, number);
        expect(numberInput.value).toEqual(number);


        await waitFor(() => {
         expect(screen.getByTestId(/country-0/i).value).toBe(countriesResponse[0].callCode);
        });

    
    })
    

    test("mock server request", async () => {

        axios.get.mockResolvedValue({ data: countriesResponse });
        axios.post.mockResolvedValue({ data: { name: "test name", phoneNumber: "number", photo: "" } });
        
        render(<MockAddModal />)
         
        await waitFor(() => {
         expect(screen.getByTestId(/country-0/i).value).toBe(countriesResponse[0].callCode);
        });
        
        const number = "+2342527957235";
        const numberInput = screen.getByPlaceholderText("phone number");
        userEvent.type(numberInput, number);
    
        const addBtn = screen.getByText(/add contact/i)
        expect(addBtn).toBeInTheDocument();

        fireEvent.click(addBtn);
        expect(addBtn.textContent).not.toEqual("Add Contact");
       
    })
 })