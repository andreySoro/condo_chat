const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const User = require("../models/User");
const {
  userQueries,
  provinceQueries,
  countryQueries,
  cityQueries,
  addressQueries,
} = require("./queries");
const {
  userMutations,
  countryMutations,
  provinceMutations,
  cityMutations,
  addressMutations,
} = require("./mutations");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQueries,
    ...provinceQueries,
    ...countryQueries,
    ...cityQueries,
    ...addressQueries,
  },
});
const RootMutation = new GraphQLObjectType({
  name: "RootMutatuionType",
  fields: {
    ...userMutations,
    ...countryMutations,
    ...provinceMutations,
    ...cityMutations,
    ...addressMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
