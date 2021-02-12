import { ComponentContentInput } from '../shapes/components/component-content.input';
export interface CreateItemInput {
    name: string;
    tenantId?: string;
    shapeIdentifier?: string;
    components?: {
        [componentId: string]: ComponentContentInput;
    };
    tree?: {
        parentId: string;
    };
}
