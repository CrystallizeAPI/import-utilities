"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var build_tenant_query_1 = require("./build-tenant-query");
ava_1.default('create tenant query with id', function (t) {
    var got = build_tenant_query_1.buildTenantQuery('1234').replace(/ /g, '');
    var want = "\n    query {\n      tenant {\n        get (id: \"1234\") {\n          id\n          identifier\n          name\n          rootItemId\n          availableLanguages {\n            code\n            name\n            system\n          }\n          defaults {\n            language\n            currency\n          }\n          vatTypes {\n            id\n            name\n            percent\n          }\n          shapes {\n            id\n            name\n          }\n        }\n      }\n    }\n  "
        .replace(/\n/g, '')
        .replace(/ /g, '');
    t.is(got, want, 'mutation string should match');
});
