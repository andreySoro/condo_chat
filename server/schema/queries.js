const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
const {
  UserType,
  ProvinceType,
  CountryType,
  CityType,
  AddressType,
  BlogPostType,
  TagType,
  CommentType,
  images,
} = require("./typeDefenition");
const User = require("../models/User");
const Provinces = require("../models/Provinces");
const Country = require("../models/Country");
const City = require("../models/City");
const Address = require("../models/Address");
const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");
const Tag = require("../models/Tags");
const { extractUserIdFromToken } = require("../utils/extractUserIdFromToken");
const getUploadedImagesUrl = require("../utils/imageUpload");

//USER QUERIES
const userQueries = {
  getUsers: {
    type: new GraphQLList(UserType),
    async resolve(parents, args) {
      return User.find();
    },
  },
  getUser: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve(parents, args, context) {
      return User.findOne({ id: args.id });
    },
  },
  getUsersForGivenAddress: {
    type: new GraphQLList(UserType),
    args: { addressId: { type: GraphQLID } },
    resolve(parents, args) {
      return User.find({ addressId: args.addressId });
    },
  },
};

//COUNTRY QUERIES
const countryQueries = {
  getCountries: {
    type: new GraphQLList(CountryType),
    async resolve(parents, args) {
      return Country.find();
    },
  },
  getCountryByName: {
    type: CountryType,
    args: { name: { type: GraphQLString } },
    resolve(parents, args) {
      return Country.findOne({ name: args.name });
    },
  },
};

//PROVINCE QUERIES
const provinceQueries = {
  getProvinces: {
    type: new GraphQLList(ProvinceType),
    resolve(parents, args) {
      return Provinces.find({ country: 1 }); //HARDCODED TO BE CANADA FOR NOW
    },
  },
  getProvincesCountrySpecific: {
    type: new GraphQLList(ProvinceType),
    args: {
      countryId: { type: GraphQLID },
      name: { type: GraphQLString },
    },
    async resolve(parents, args) {
      if (args.countryId) {
        return Provinces.find({ country: args.countryId });
      } else {
        const extractedId = await Country.findOne({
          name: args.name.trim().toLowerCase(),
        }).then((res) => res.id);
        return Provinces.find().then((res) =>
          res.filter((res) => res.country === extractedId)
        );
      }
    },
  },
};

//CITY QUERIES
const cityQueries = {
  getCities: {
    type: new GraphQLList(CityType),
    resolve(parents, args) {
      return City.find();
    },
  },
  getCityByProvinceId: {
    type: new GraphQLList(CityType),
    args: {
      id: { type: GraphQLID },
    },
    resolve(parents, args) {
      return City.find({ province: args.id });
    },
  },
  autocompleteCity: {
    type: new GraphQLList(CityType),
    args: { city: { type: GraphQLString }, provinceId: { type: GraphQLID } },
    async resolve(parents, args) {
      const cities = await City.aggregate([
        {
          $search: {
            index: "searchCity",
            autocomplete: {
              query: args.city,
              path: "name",
              tokenOrder: "sequential",
            },
          },
        },
        {
          $limit: 10,
        },
        {
          $match: {
            province: Number(args.provinceId),
          },
        },
      ]);
      return cities || [];
    },
  },
};

//ADDRESS QUERIES
const addressQueries = {
  getAddresses: {
    type: new GraphQLList(AddressType),
    resolve(parents, args) {
      return Address.find();
    },
  },
  getCityAdresses: {
    type: new GraphQLList(AddressType),
    args: { cityId: { type: GraphQLID } },
    resolve(parents, args) {
      return Address.find({ city: args.cityId });
    },
  },
  autocompleteAddress: {
    type: new GraphQLList(AddressType),
    args: { address: { type: GraphQLString }, cityId: { type: GraphQLID } },
    async resolve(parents, args) {
      const addresses = await Address.aggregate([
        {
          $search: {
            index: "searchAddress",
            autocomplete: {
              query: args.address,
              path: "addressName",
              tokenOrder: "sequential",
            },
          },
        },
        {
          $limit: 10,
        },
        {
          $match: {
            city: Number(args.cityId),
          },
        },
      ]);
      return addresses || [];
    },
  },
};

//BLOGPOST QUERIES
const blogPostQueries = {
  getBlogPostsByAddress: {
    type: new GraphQLList(BlogPostType),
    args: { addressId: { type: GraphQLID } },
    async resolve(parents, args, ctx) {
      const userId =
        extractUserIdFromToken(ctx?.headers?.authorization) || null;
      if (userId) {
        const postsArray = await BlogPost.find({
          address: args.addressId,
        })
          // .limit(10)
          .then((blogPost) => {
            return blogPost.map((individualPosts) => {
              return {
                ...individualPosts._doc,
                upVote: individualPosts.upVote.filter((item) => item == userId),
                downVote: individualPosts.downVote.filter(
                  (item) => item == userId
                ),
              };
            });
          });
        return postsArray;
      }
    },
  },
  getBlogPostById: {
    type: BlogPostType,
    args: { id: { type: GraphQLID } },
    async resolve(parents, args, ctx) {
      const userId =
        extractUserIdFromToken(ctx?.headers?.authorization) || null;
      if (userId) {
        return BlogPost.findOne({ id: args.id }).then((blogPost) => {
          return {
            ...blogPost._doc,
            upVote: blogPost.upVote.filter((item) => item == userId),
            downVote: blogPost.downVote.filter((item) => item == userId),
          };
        });
      }
    },
  },
};

//COMMENT QUERIES
const commentQueries = {
  getCommentsByBlogPostId: {
    type: new GraphQLList(CommentType),
    args: { blogPostId: { type: GraphQLID } },
    async resolve(parents, args, ctx) {
      const userId =
        extractUserIdFromToken(ctx?.headers?.authorization) || null;
      if (userId) {
        const commentsArray = await Comment.find({ postId: args.blogPostId })
          // .limit(10)
          .then((comments) => {
            return comments.map((individualComments) => {
              return {
                ...individualComments._doc,
                upVote: individualComments.upVote.filter(
                  (item) => item == userId
                ),
                downVote: individualComments.downVote.filter(
                  (item) => item == userId
                ),
              };
            });
          });
        return commentsArray;
      }
    },
  },
};

//TAG QUERIES
const tagQueries = {
  getAllTags: {
    type: new GraphQLList(TagType),
    async resolve(parents, args) {
      return await Tag.find();
    },
  },
};

module.exports = {
  userQueries,
  provinceQueries,
  countryQueries,
  cityQueries,
  addressQueries,
  blogPostQueries,
  commentQueries,
  tagQueries,
};
