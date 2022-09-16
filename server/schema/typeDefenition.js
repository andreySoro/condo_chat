const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const Country = require("../models/Country");
const Province = require("../models/Provinces");
const City = require("../models/City");
const Address = require("../models/Address");
const User = require("../models/User");
const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

const CountryType = new GraphQLObjectType({
  name: "Country",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});
const ProvinceType = new GraphQLObjectType({
  name: "Province",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: {
      type: CountryType,
      resolve(parents, args) {
        return Country.findOne({ id: parents.country });
      },
    },
  }),
});

const CityType = new GraphQLObjectType({
  name: "City",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    province: {
      type: ProvinceType,
      resolve(parents, args) {
        return Province.findOne({ id: parents.province });
      },
    },
  }),
});

const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    id: { type: GraphQLID },
    addressName: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    city: {
      type: CityType,
      resolve(parents, args) {
        return City.findOne({ id: parents.city });
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    unitNumber: { type: GraphQLString },
    address: {
      type: AddressType,
      resolve(parents, args) {
        return Address.findOne({ id: parents.address });
      },
    },
  }),
});

const BlogPostType = new GraphQLObjectType({
  name: "BlogPost",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    message: { type: GraphQLString },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parents, args) {
        return Comment.find({ postId: parents.id });
      },
    },
    upVote: { type: new GraphQLList(GraphQLString) },
    downVote: { type: new GraphQLList(GraphQLString) },
    address: {
      type: AddressType,
      resolve(parents, args) {
        return Address.findOne({ id: parents.address });
      },
    },
    commentsCount: {
      type: GraphQLInt,
      resolve(parents, args) {
        return Comment.find({ postId: parents.id }).count();
      },
    },
    votesCount: {
      type: GraphQLInt,
      resolve(parents, args) {
        return parents.upVote.length - parents.downVote.length;
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: {
    id: { type: GraphQLID },
    message: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parents, args) {
        return User.findOne({ id: parents.author });
      },
    },
    postId: {
      type: BlogPostType,
      resolve(parents, args) {
        return BlogPost.findOne({ id: parents.postId });
      },
    },
    upVote: { type: new GraphQLList(GraphQLString) },
    downVote: { type: new GraphQLList(GraphQLString) },
  },
});

module.exports = {
  UserType,
  ProvinceType,
  CountryType,
  CityType,
  AddressType,
  BlogPostType,
  CommentType,
};
