import { EnumType } from 'json-to-graphql-query';
import { ShapeComponentInput } from './shape-components/shape-component.input';
interface ShapeTypeEnum {
    [name: string]: EnumType;
}
export declare const shapeTypes: ShapeTypeEnum;
export interface ShapeInput {
    tenantId?: string;
    name: string;
    type: EnumType;
    components?: ShapeComponentInput[];
}
export {};
