dotenv.config();

// Обязательно для работы dgraph, иначе получаем self is undefined
import "node-self";

import { serverStartLogo } from "./server_logo";
// const socket = require("socket.io");
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import http from "http";
import typeDefs from "./src/db/schema";
import { resolvers } from "./src/resolvers/users";
import app from "./src/app";
import * as dgraph from "dgraph-js";
import * as grpc from "@grpc/grpc-js";
// import db from "./src/db/db";

const PORT = process.env.PORT || 3002;

const graphqlPort = process.env.GRAPHQL_PORT || 4000;

const dgraphPort = process.env.DGRAPH_PORT || 9080;
const dgraphHost = process.env.DGRAPH_HOST || "localhost";
const showPlayground = process.env.ENV === "development";
// const graphqlPath = '/graphql';

const clientStub = new dgraph.DgraphClientStub(
  `${dgraphHost}:${dgraphPort}`,
  grpc.credentials.createInsecure()
);

const dgraphClient = new dgraph.DgraphClient(clientStub);
dgraphClient.setDebugMode(true);

const customFormatErrorFnForDebugging = (err) => {
  console.log(err);
  return {
    message: err.message,
    locations: err.locations,
    path: err.path,
  };
};

const startApolloServer = async (typeDefs, resolvers) => {
  try {
    const dgraphClient = new dgraph.DgraphClient(clientStub);
    const httpServer = http.createServer(app);
    const context = { db: dgraphClient };
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context,
      debug: false,
      formatError: customFormatErrorFnForDebugging,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await server.start();
    server.applyMiddleware({ app });
    // await db.sequelize.authenticate();
    // await sequelize.drop();
    // await sequelize.sync();
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

    console.log("\x1b[36m%s\x1b[0m", serverStartLogo(PORT, server.graphqlPath));
  } catch (err) {
    console.log(err);
    return logger.error("Error starting the server: ", err);
  }
};

startApolloServer(typeDefs, resolvers);
