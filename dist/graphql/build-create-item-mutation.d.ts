import { DocumentInput } from '../types/document/document.input';
import { FolderInput } from '../types/folder/folder.input';
import { ProductInput } from '../types/product/product.input';
export declare const buildCreateItemMutation: (input: ProductInput | DocumentInput | FolderInput, type: 'product' | 'document' | 'folder', language: string) => string;
