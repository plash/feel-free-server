const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const AuthPayload = require("./resolvers/AuthPayload");
const Subscription = require("./resolvers/Subscription");
const Users = require("./resolvers/Users");

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription,
  Users
};

const prisma = new Prisma({
  typeDefs: "config/generated/prisma.graphql",
  endpoint: "__YOUR_PRISMA_ENDPOINT",
  secret: "secret",
  debug: true
});

const server = new GraphQLServer({
  typeDefs: "./config/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: prisma
  })
});

const options = {
  port: 4000
};

server.start(options, () => console.log("Server is running on port 4000"));
