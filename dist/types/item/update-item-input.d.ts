import { ComponentContentInput } from '../shapes';
export interface UpdateItemInput {
    name: string;
    components?: {
        [componentId: string]: ComponentContentInput;
    };
}
