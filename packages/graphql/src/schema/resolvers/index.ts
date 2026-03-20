import { GraphQLError, Kind, type ValueNode } from "graphql";

import { grievanceResolvers } from "./grievance.js";
import { userResolvers } from "./user.js";
import { clusterResolvers } from "./cluster.js";

function parseLiteral(ast: ValueNode): unknown {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(ast.value);
    case Kind.NULL:
      return null;
    case Kind.OBJECT: {
      const value: Record<string, unknown> = {};
      for (const field of ast.fields) {
        value[field.name.value] = parseLiteral(field.value);
      }
      return value;
    }
    case Kind.LIST:
      return ast.values.map((value) => parseLiteral(value));
    default:
      return null;
  }
}

export const resolvers = {
  JSONObject: {
    serialize(value: unknown): unknown {
      if (value === null || typeof value !== "object") {
        return value;
      }
      return value;
    },

    parseValue(value: unknown): unknown {
      if (value === null || typeof value === "object") {
        return value;
      }
      throw new GraphQLError("JSONObject must be an object or null");
    },

    parseLiteral(ast: ValueNode): unknown {
      if (ast.kind === Kind.NULL) {
        return null;
      }
      if (ast.kind !== Kind.OBJECT && ast.kind !== Kind.LIST) {
        throw new GraphQLError("JSONObject literal must be an object or list");
      }
      return parseLiteral(ast);
    },
  },

  Query: {
    ...grievanceResolvers.Query,
    ...clusterResolvers.Query,
    ...userResolvers.Query,
  },

  Mutation: {
    ...grievanceResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
