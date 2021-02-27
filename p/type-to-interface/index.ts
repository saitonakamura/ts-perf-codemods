import * as babelTypes from "@babel/types";
import templateBuilder from "@babel/template";
import type { Visitor } from "@babel/traverse";

// const isNotNull = <T>(x: T): x is NonNullable<T> => x != null;

export const plugin = ({
  types: t,
  template: _,
}: {
  types: typeof babelTypes;
  template: typeof templateBuilder;
}): { visitor: Visitor } => {
  return {
    visitor: {
      TSTypeAliasDeclaration(path) {
        if (t.isTSTypeLiteral(path.node.typeAnnotation)) {
          path.replaceWith(
            t.tsInterfaceDeclaration(
              path.node.id,
              undefined,
              undefined,
              t.tsInterfaceBody(path.node.typeAnnotation.members)
            )
          );
        }
      },
    },
  };
};
