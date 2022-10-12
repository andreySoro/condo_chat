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
const Tag = require("../models/Tags");

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
    reputation: { type: GraphQLInt },
    address: {
      type: AddressType,
      resolve(parents, args) {
        return Address.findOne({ id: parents.address });
      },
    },
    fcmToken: { type: new GraphQLList(GraphQLString)}
  }),
});

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

const BlogPostType = new GraphQLObjectType({
  name: "BlogPost",
  fields: () => ({
    id: { type: GraphQLID },
    author: {
      type: UserType,
      resolve(parents, args) {
        return User.findOne({ id: parents.author });
      },
    },
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
    },
    // votesCount: {
    //   type: GraphQLInt,
    //   resolve(parents, args) {
    //     return parents.upVote.length - parents.downVote.length;
    //   },
    // },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    tags: {
      type: new GraphQLList(TagType),
      resolve(parents, args) {
        return Tag.find({ id: { $in: parents.tags } });
      },
    },
    imageUrl: { type: GraphQLString },
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
    replyId: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    upVote: { type: new GraphQLList(GraphQLString) },
    downVote: { type: new GraphQLList(GraphQLString) },
    votesCount: {
      type: GraphQLInt,
      resolve(parents, args) {
        return parents.upVote.length - parents.downVote.length;
      },
    },
    imageUrl: { type: GraphQLString },
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
  TagType,
};
