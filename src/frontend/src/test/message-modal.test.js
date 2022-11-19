import { render, screen } from '@testing-library/react';
import MessageModal from '../components/message_modal';

describe('MessageModalTest', () => { 

    test('title text', () => { 
        const fn = jest.fn();
        const title = "title";
        const message = "message body";
        render(
            <MessageModal obj={{show:true, title, message}} setShow={fn} />
        );
        const titleElement = screen.getByText(title);
        const messageElement = screen.getByText(message);
        expect(titleElement).toBeInTheDocument();
        expect(messageElement).toBeInTheDocument();
     })
    
 })