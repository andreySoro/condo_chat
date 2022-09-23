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
  blogPostQueries,
  commentQueries,
  tagQueries,
} = require("./queries");
const {
  userMutations,
  countryMutations,
  provinceMutations,
  cityMutations,
  addressMutations,
  blogPostMutations,
  tagMutations,
} = require("./mutations");
const { shield } = require("graphql-shield");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQueries,
    ...provinceQueries,
    ...countryQueries,
    ...cityQueries,
    ...addressQueries,
    ...blogPostQueries,
    ...commentQueries,
    ...tagQueries,
  },
});
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userMutations,
    ...countryMutations,
    ...provinceMutations,
    ...cityMutations,
    ...addressMutations,
    ...blogPostMutations,
    ...tagMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
