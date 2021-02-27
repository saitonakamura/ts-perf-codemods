import { plugin } from "../type-to-interface/index";
import babel from "@babel/core";
import * as parser from "@babel/parser";
import recast from "recast";
import path from "path";
import fs from "fs";

const files = process.argv.slice(2);

files.forEach(transformFile);

function transformFile(filename: string) {
  const file = path.join(process.cwd(), filename);

  const input = fs.readFileSync(file, "utf-8");
  const output = transform(input, filename, plugin);
  fs.writeFileSync(file, output);
}

function transform(source: string, filename: string, codemod: babel.PluginItem) {
  const ast = recast.parse(source, {
    parser: {
      parse(source: string) {
        return parser.parse(source, {
          // filename,
          tokens: true,
          sourceType: "module",
          plugins: ["typescript", "classProperties", "jsx"],
        });
      },
    },
  });

  babel.transformFromAstSync(ast, source, {
    code: false,
    // cloneInputAst: false,
    configFile: false,
    plugins: [codemod],
  });

  return recast.print(ast).code;
}
