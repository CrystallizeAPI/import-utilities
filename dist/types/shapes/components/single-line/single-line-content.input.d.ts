import { ComponentContentInput } from '../component-content.input';
export interface SingleLineComponentContentInput extends ComponentContentInput {
    singleLine: {
        text?: string;
    };
}
