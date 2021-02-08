import { EnumType } from 'json-to-graphql-query';
import { ComponentInput } from './components/component.input';
import { KeyValuePairInput } from './key-value-pair.input';
export declare const shapeTypes: {
    product: EnumType;
    document: EnumType;
    folder: EnumType;
};
export interface ShapeInput {
    identifier?: string;
    tenantId?: string;
    name: string;
    type: EnumType;
    meta?: KeyValuePairInput[];
    components?: ComponentInput[];
}
