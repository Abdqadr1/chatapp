import { render, screen } from '@testing-library/react';
import ImageModal from '../components/image-modal';
import image from "../images/female-av2.png";

describe('ImageModalTest', () => { 

    test('title text', () => { 
        const fn = jest.fn();
        const altText = "message";
        render(
            <ImageModal obj={{show:true, image}} setShow={fn} />
        );
        const closeElement = screen.getByText("Close");
        expect(closeElement).toBeInTheDocument();

        const imageElement = screen.getAllByAltText(altText)[0];
        expect(imageElement).toBeInTheDocument();
     })
    
 })