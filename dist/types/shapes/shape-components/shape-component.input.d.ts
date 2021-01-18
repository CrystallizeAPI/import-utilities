import { EnumType } from 'json-to-graphql-query';
interface ComponentTypeEnum {
    [name: string]: EnumType;
}
export declare const componentTypes: ComponentTypeEnum;
export interface ComponentConfigInput {
}
export interface ShapeComponentInput {
    id: string;
    name: string;
    type: EnumType;
    description?: string;
    config?: ComponentConfigInput;
}
export {};
