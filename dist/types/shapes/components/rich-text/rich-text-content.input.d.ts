import { ComponentContentInput } from '../component-content.input';
export interface RichTextComponentContentInput extends ComponentContentInput {
    richText: {
        json?: JSON[];
        html?: string[];
    };
}
