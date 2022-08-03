const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const user = [
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Jane", age: 33 },
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // PROJECTS
    getUsers: {
      type: new GraphQLList(UserType),
      resolve(parents, args) {
        return user;
      },
    },
    getUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parents, args) {
        return user.find((user) => user.id == args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
