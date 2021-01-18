import { EnumType } from 'json-to-graphql-query';
import { ComponentInput } from './components/component.input';
interface ShapeTypeEnum {
    [name: string]: EnumType;
}
export declare const shapeTypes: ShapeTypeEnum;
export interface ShapeInput {
    tenantId?: string;
    name: string;
    type: EnumType;
    components?: ComponentInput[];
}
export {};
