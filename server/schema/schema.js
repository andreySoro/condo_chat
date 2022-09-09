const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const User = require("../models/User");
const { userQueries } = require("./queries");
const { userMutations } = require("./mutations");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQueries,
  },
});
const RootMutation = new GraphQLObjectType({
  name: "RootMutatuionType",
  fields: {
    ...userMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
