const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const { UserType } = require("./typeDefenition");
const User = require("../models/User");

const userQueries = {
  getUsers: {
    type: new GraphQLList(UserType),
    resolve(parents, args) {
      return User.find();
    },
  },
  getUser: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve(parents, args) {
      return User.findOne({ id: args.id });
    },
  },
};

module.exports = {
  userQueries,
};
