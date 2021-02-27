import { plugin } from "./index";
import * as babel from "@babel/core";

const parse = (source: string) =>
  babel.parseAsync(source, {
    // tokens: true,
    sourceType: "module",
    plugins: ["@babel/plugin-transform-typescript"],
  });

const transform = (ast: babel.Node, source: string) =>
  babel.transformFromAstAsync(ast, source, {
    ast: true,
    code: true,
    configFile: false,
    plugins: [plugin],
  });

const source = `
type A = { f: string; x: number }
export const a = 1
`.trim();

describe("type-to-interface", () => {
  it("should", async () => {
    const ast = await parse(source);
    expect(ast).toBeTruthy();
    const result = await transform(ast as any, source);
    expect(result).toBeTruthy();
    console.log(result?.code);
  });
});
