import { EnumType } from 'json-to-graphql-query';
import { ShapeComponentInput } from './shape-components/shape-component.input';
export declare enum ShapeType {
    product = "product",
    document = "document",
    folder = "folder"
}
export interface ShapeInput {
    tenantId?: string;
    name: string;
    type: EnumType;
    components?: ShapeComponentInput[];
}
