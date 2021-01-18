import { ShapeComponentInput, ComponentConfigInput } from '../shape-component.input';
export interface ContentChunkComponentConfigInput extends ComponentConfigInput {
    contentChunk: {
        components: ShapeComponentInput[];
        repeatable?: boolean;
    };
}
export interface ContentChunkComponentInput extends ShapeComponentInput {
    config: ContentChunkComponentConfigInput;
}
