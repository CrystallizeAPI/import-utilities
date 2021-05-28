// import {  shapeTypes } from '../../types/shapes'

export interface ShapeComponent {
  id: string;
  name: string;
  type: 'boolean' | 'componentChoice' | 'contentChunk' | 'datetime' | 'gridRelations' | 'images' | 'itemRelations' | 'location' | 'numeric' | 'paragraphCollection' | 'propertiesTable' | 'richText' | 'singleLine' | 'videos';
}

export interface Shape {
  type: 'product' | 'document' | 'folder';
  name: string;
  identifier: string;
  components?: ShapeComponent[]
}

export interface PriceVariant {
  identifier: string;
  name: string;
  currency: string;
}

export interface Language {
  code: string;
  language: string;
  isDefault?: boolean;
}

export interface VatType {
  name: string;
  percent: number;
}

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: PriceVariant[];
  languages?: Language[];
  vatType?: VatType[];
}