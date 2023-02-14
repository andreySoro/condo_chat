const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");
const {
  UserType,
  CountryType,
  ProvinceType,
  CityType,
  AddressType,
  BlogPostType,
  CommentType,
  TagType,
} = require("./typeDefenition");
const User = require("../models/User");
const Country = require("../models/Country");
const Province = require("../models/Provinces");
const City = require("../models/City");
const Address = require("../models/Address");
const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");
const Tag = require("../models/Tags");
const { updateReputation } = require("../utils/updateReputation");
const { votePost } = require("../utils/voting");

//USER MUTATIONS
const userMutations = {
  updateUserInfo: {
    type: UserType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      unitNumber: { type: GraphQLString },
      address: { type: GraphQLID },
      contentFilter: { type: GraphQLBoolean },
    },
    resolve(parents, args, ctx) {
      const argsId = args.id;
      const user = ctx.headers.userId;
      return User.findOneAndUpdate(
        { id: argsId ? argsId : user },
        {
          $set: {
            name: args.name,
            email: args.email,
            address: args.address,
            unitNumber: args.unitNumber,
            contentFilter: args.contentFilter,
          },
        },
        { new: true }
      );
    },
  },
};

//COUNTRY MUTATIONS
const countryMutations = {
  addCountry: {
    type: CountryType,
    args: { name: { type: GraphQLString } },
    resolve: async (parents, args) => {
      const lastIdNumber = await Country.find().then(
        (res) => res[res?.length - 1].id
      );
      const contry = new Country({
        id: lastIdNumber + 1,
        name: args.name,
      });
      return await contry.save();
    },
  },
  getAllCountries: {
    type: new GraphQLList(CountryType),
    resolve(parents, args) {
      return Country.find();
    },
  },
};

//PROVINCE MUTATIONS
const provinceMutations = {
  addProvince: {
    type: ProvinceType,
    args: {
      name: { type: GraphQLString },
      countryId: { type: GraphQLID },
    },
    resolve: async (parents, args) => {
      const lastIdNumber = await Province.find().then(
        (res) => res[res?.length - 1].id
      );
      const province = new Province({
        id: lastIdNumber + 1,
        name: args.name,
        country: args.countryId,
      });
      return await province.save();
    },
  },
};

//CITY MUTATIONS
const cityMutations = {
  addCity: {
    type: CityType,
    args: {
      provinceId: { type: GraphQLID },
      name: { type: GraphQLString },
    },
    async resolve(parents, args) {
      const isCityExists = await City.findOne({ name: args.name });
      if (isCityExists) {
        return isCityExists;
      }
      const lastIdNumber = await City.find().then(
        (res) => res[res?.length - 1].id
      );
      const city = new City({
        id: lastIdNumber + 1,
        name: args.name,
        province: args.provinceId,
      });

      return await city.save();
    },
  },
};

// const updateUserInfo = async (args) => {
//   console.log("updating user", args);
//   await User.findOneAndUpdate(
//     { id: args.id },
//     {
//       $set: {
//         name: args.userName,
//         email: args.email,
//         address: args.address,
//         unitNumber: args.unitNumber,
//       },
//     },
//     { new: true }
//   );
// };
//ADDRESS MUTATIONS
const addressMutations = {
  createAddress: {
    type: AddressType,
    args: {
      id: { type: GraphQLID },
      addressName: { type: GraphQLString },
      postalCode: { type: GraphQLString },
      city: { type: GraphQLID },
    },
    async resolve(parents, args) {
      const doesAddressExist = await Address.findOne({
        addressName: { $regex: new RegExp(args.addressName, "i") }, //regex will disregard case sensetivity
      });
      if (doesAddressExist) {
        return doesAddressExist;
      }
      const lastIdNumber = await Address.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      const newAddress = await new Address({
        id: lastIdNumber + 1,
        addressName: args.addressName,
        postalCode: args.postalCode,
        city: args.city,
      }).save();
      return newAddress;
    },
  },
};

//BLOG POST MUTATIONS
const blogPostMutations = {
  addBlogPost: {
    type: BlogPostType,
    args: {
      title: { type: GraphQLString },
      message: { type: GraphQLString },
      addressId: { type: GraphQLID },
      tags: { type: new GraphQLList(GraphQLID) },
      imageUrl: { type: GraphQLString },
    },
    async resolve(parents, args, ctx) {
      const lastIdNumber = await BlogPost.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      const userId = ctx?.headers?.userId;

      const isAddressExists = await Address.findOne({ id: args.addressId });
      if (!isAddressExists) throw new Error("Address does not exist");
      return new BlogPost({
        id: lastIdNumber + 1,
        author: userId,
        title: args.title,
        message: args.message,
        address: args.addressId,
        tags: args.tags,
        imageUrl: args.imageUrl,
      }).save();
    },
  },
  upVotePost: {
    type: BlogPostType,
    args: { postId: { type: GraphQLID } },
    async resolve(parents, args, ctx) {
      const post = await BlogPost.findOne({
        id: args.postId,
      });
      if (!post) throw new Error("Post does not exist");
      const userId = ctx?.headers?.userId;
      if (!userId) throw new Error("Cannot find userId, bad token...┐(°_°)┌");
      const isUpvoted = post.upVote.includes(userId);
      const isDownVoted = post.downVote.includes(userId);
      const reputationAmount = isUpvoted ? -1 : isDownVoted ? 2 : 1;

      await votePost(post, isUpvoted, isDownVoted, userId, "upvote"); // post voting
      if (post.author !== userId)
        updateReputation(reputationAmount, post.author);
      return post;
    },
  },
  downVotePost: {
    type: BlogPostType,
    args: { postId: { type: GraphQLID } },
    async resolve(parents, args, ctx) {
      const post = await BlogPost.findOne({
        id: args.postId,
      });
      if (!post) throw new Error("Post does not exist");
      const userId = ctx?.headers?.userId;
      if (!userId) throw new Error("Cannot find userId, bad token...┐(°_°)┌");
      const isDownVoted = post.downVote.includes(userId);
      const isUpvoted = post.upVote.includes(userId);
      const reputationAmount = isDownVoted ? 1 : isUpvoted ? -2 : -1;

      await votePost(post, isUpvoted, isDownVoted, userId, "downvote"); // post voting
      if (post.author !== userId)
        updateReputation(reputationAmount, post.author);
      return post;
    },
  },
  addComment: {
    type: CommentType,
    args: {
      postId: { type: GraphQLID },
      message: { type: GraphQLString },
      replyId: { type: GraphQLID },
      imageUrl: { type: GraphQLString },
    },
    async resolve(parents, args, ctx) {
      const userId = ctx?.headers?.userId;
      const lastIdNumber = await Comment.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      if (lastIdNumber + 1 == args.replyId)
        throw new Error("Cant reply to self! Change or remove replyId");
      const newComment = await new Comment({
        id: lastIdNumber + 1,
        message: args.message,
        author: userId,
        postId: args.postId,
        replyId: args.replyId,
        imageUrl: args.imageUrl,
      }).save();

      if (newComment) {
        await BlogPost.findOneAndUpdate(
          { id: args.postId },
          {
            $push: {
              comments: newComment.id,
            },
          },
          { new: true }
        );
      }
      return newComment;
    },
  },
  deleteComment: {
    type: CommentType,
    args: { commentId: { type: GraphQLID } },
    async resolve(parents, args) {
      const comment = await Comment.findOneAndDelete({ id: args.commentId });
      if (comment) {
        await BlogPost.findOneAndUpdate(
          { id: comment.postId },
          {
            $pull: {
              comments: comment.id,
            },
          }
        );
      }
      return comment;
    },
  },
};

const tagMutations = {
  addTag: {
    type: TagType,
    args: { name: { type: GraphQLString } },
    async resolve(parents, args) {
      const lastIdNumber = await Tag.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      return new Tag({
        id: Number(lastIdNumber) + 1,
        name: args.name,
      }).save();
    },
  },
};

module.exports = {
  userMutations,
  countryMutations,
  provinceMutations,
  cityMutations,
  addressMutations,
  blogPostMutations,
  tagMutations,
};
