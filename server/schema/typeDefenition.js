const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");

const AreaType = new GraphQLObjectType({
  name: "Area",
  fields: () => ({
    addressOne: { type: GraphQLString },
    addressTwo: { type: GraphQLString },
    city: { type: GraphQLString },
    province: { type: GraphQLString },
    postalCode: { type: GraphQLString },
  }),
});
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    area: {
      type: AreaType,
    },
  }),
});

module.exports = {
  AreaType,
  UserType,
};
