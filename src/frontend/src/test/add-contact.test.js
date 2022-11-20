import { render, screen, fireEvent } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AddContactModal from "../../src/components/add-contact-modal";

const MockAddModal = () => {
    return (
        <BrowserRouter>
            <AddContactModal obj={{show:true}} setShow={jest.fn()} auth={{access_token: "toks..."}} />
        </BrowserRouter>
    )
}

describe('AddContactModalTest', () => { 

    test('static text', () => {
        render(<MockAddModal />);

        const title = screen.getByText(/add new contact/i);
        expect(title).toBeInTheDocument();
        const addBtn = screen.getByText(/add contact/i);
        expect(addBtn).toBeInTheDocument();

    });

    test("should fill input", async () => {
        render( <MockAddModal />)

        const number = "+2342527957235";
        const numberInput = screen.getByPlaceholderText("phone number");
        userEvent.type(numberInput, number);
        expect(numberInput.value).toEqual(number);
    
    })
    

    it("should change text when button clicked", async () => {
        render(<MockAddModal />)
        
        const number = "+2342527957235";
        const numberInput = screen.getByPlaceholderText("phone number");
        userEvent.type(numberInput, number);
    
        const addBtn = screen.getByText(/add contact/i)
        expect(addBtn).toBeInTheDocument();

        fireEvent.click(addBtn);
        expect(addBtn.textContent).not.toEqual("Add Contact");

    })
    
 })