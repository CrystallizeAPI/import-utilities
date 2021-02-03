"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var build_delete_item_mutation_1 = require("./build-delete-item-mutation");
ava_1.default('delete mutation for product', function (t) {
    var got = build_delete_item_mutation_1.buildDeleteItemMutation('1234', 'product').replace(/ /g, '');
    var want = "\n    mutation {\n      product {\n        delete (id: \"1234\")\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
ava_1.default('delete mutation for document', function (t) {
    var got = build_delete_item_mutation_1.buildDeleteItemMutation('1234', 'document').replace(/ /g, '');
    var want = "\n    mutation {\n      document {\n        delete (id: \"1234\")\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
ava_1.default('delete mutation for folder', function (t) {
    var got = build_delete_item_mutation_1.buildDeleteItemMutation('1234', 'folder').replace(/ /g, '');
    var want = "\n    mutation {\n      folder {\n        delete (id: \"1234\")\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
