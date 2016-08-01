/// <reference path="../../../default/typescript/typescriptAPI/TypeScriptAPIPlugin.d.ts" />
import * as fs from "fs";

SupCore.system.registerPlugin("typescriptAPI", "EasyStar", {
  code: "",
  defs: fs.readFileSync(`${__dirname}/../typings/easystarjs/easystarjs.d.ts`, { encoding: "utf8" }),
});
