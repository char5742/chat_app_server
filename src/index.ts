import express from "express";
import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "node:fs";
import { context, wscontext } from "@/src/infrastructure/context";
import { resolvers } from "@/src/infrastructure/resolver";
const app: express.Express = express();

const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const typeDefs = readFileSync("graphql/schema.graphql", "utf8");
const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema, context: wscontext }, wsServer);

const server = new ApolloServer({
  schema,
  csrfPrevention: false,
  cache: "bounded",
  context,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const port = process.env.PORT || 3000;
server.start().then(() => server.applyMiddleware({ app }));
httpServer.listen(port, () => {
  console.log(
    `Server is now running on http://localhost:${port}${server.graphqlPath}`
  );
});
