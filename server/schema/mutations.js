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

const userMutations = {
  updateUserInfo: {
    type: UserType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      province: { type: GraphQLString },
      city: { type: GraphQLString },
      addressOne: { type: GraphQLString },
      addressTwo: { type: GraphQLString },
      postalCode: { type: GraphQLString },
    },
    resolve(parents, args) {
      return User.findOneAndUpdate(
        { id: args.id },
        {
          $set: {
            name: args.name,
            email: args.email,
            "area.province": args.province,
            "area.city": args.city,
            "area.addressOne": args.addressOne,
            "area.addressTwo": args.addressTwo,
            "area.postalCode": args.postalCode,
          },
        },
        { new: true }
      );
    },
  },
};

module.exports = {
  userMutations,
};
