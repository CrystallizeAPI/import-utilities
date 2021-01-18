import { EnumType } from 'json-to-graphql-query';
export declare enum ComponentType {
    boolean = "boolean",
    componentChoice = "componentChoice",
    contentChunk = "contentChunk",
    datetime = "datetime",
    gridRelations = "gridRelations",
    images = "images",
    itemRelations = "itemRelations",
    location = "location",
    paragraphCollection = "paragraphCollection",
    propertiesTable = "propertiesTable",
    richText = "richText",
    singleLine = "singleLine",
    videos = "videos"
}
export interface ComponentConfigInput {
}
export interface ShapeComponentInput {
    id: string;
    name: string;
    type: EnumType;
    description?: string;
    config?: ComponentConfigInput;
}
