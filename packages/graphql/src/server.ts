import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { resolvers } from "./schema/resolvers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "..", "src", "schema", "typeDefs.gql");
const typeDefs = readFileSync(schemaPath, "utf-8");
const PORT = Number(process.env.GRAPHQL_PORT ?? 4000);

interface GraphQLContext {
  authHeader?: string;
}

async function bootstrap(): Promise<void> {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => ({
      authHeader: req.headers.authorization,
    }),
  });

  console.log(`[graphql] GraphQL server ready at ${url}`);
}

void bootstrap();
