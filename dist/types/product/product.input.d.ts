import { ComponentContentInput } from '../shapes/components/component-content.input';
import { ProductVariantInput } from './product-variant.input';
export interface ProductInput {
    tenantId: string;
    shapeId?: string;
    vatTypeId: string;
    name: string;
    variants: ProductVariantInput[];
    components?: {
        [componentId: string]: ComponentContentInput;
    };
    tree?: {
        parentId: string;
    };
}
