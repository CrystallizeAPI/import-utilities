"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var build_get_items_by_shape_query_1 = require("./build-get-items-by-shape-query");
ava_1.default('get items with id and language', function (t) {
    var got = build_get_items_by_shape_query_1.buildGetItemsByShapeQuery('1234', 'en').replace(/ /g, '');
    var want = "\n    query {\n      shape {\n        get (id: \"1234\") {\n          id\n          name\n          items(language: \"en\") {\n            id\n            name\n            components {\n              componentId\n              content {\n                ... on BooleanContent {\n                  value\n                }\n                ... on ComponentChoiceContent {\n                  selectedComponent {\n                    componentId\n                    type\n                  }\n                }\n                ... on ContentChunkContent {\n                  chunks {\n                    componentId\n                    type\n                  }\n                }\n                ... on DatetimeContent {\n                  datetime\n                }\n                ... on GridRelationsContent {\n                  grids {\n                    id\n                  }\n                }\n                ... on ImageContent {\n                  images {\n                    key\n                  }\n                }\n                ... on ItemRelationsContent {\n                  items {\n                    id\n                  }\n                }\n                ... on LocationContent {\n                  lat\n                  long\n                }\n                ... on NumericContent {\n                  number\n                  unit\n                }\n                ... on PropertiesTableContent {\n                  sections {\n                    title\n                    properties {\n                      key\n                      value\n                    }\n                  }\n                }\n                ... on RichTextContent {\n                  json\n                  html\n                }\n                ... on SingleLineContent {\n                  text\n                }\n                ... on VideoContent {\n                  videos {\n                    id\n                    title\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'query string should match');
});
