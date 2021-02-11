import { ShapeInput } from '../shapes';
export interface TenantInput {
    identifier: string;
    name: string;
    shapes?: ShapeInput[];
    defaults?: {
        language?: string;
        currency?: string;
    };
}
