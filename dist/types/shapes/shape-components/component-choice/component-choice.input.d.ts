import { ShapeComponentInput, ComponentConfigInput } from '../shape-component.input';
export interface ComponentChoiceComponentConfigInput extends ComponentConfigInput {
    componentChoice: {
        choices: ShapeComponentInput[];
    };
}
export interface ComponentChoiceComponentInput extends ShapeComponentInput {
    config: ComponentChoiceComponentConfigInput;
}
