import { render, screen } from "@testing-library/react"; 
import AddContactModal from "../add-contact-modal";

describe('AddContactTest', () => { 

    test('static text', () => { 
        render(<AddContactModal />);
        const title = screen.getByText("Add New Contact");
        expect(title).toBeInTheDocument();
     })
    
 })