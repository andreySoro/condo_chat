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
  CountryType,
  ProvinceType,
  CityType,
  AddressType,
  BlogPostType,
  CommentType,
} = require("./typeDefenition");
const User = require("../models/User");
const Country = require("../models/Country");
const Province = require("../models/Provinces");
const City = require("../models/City");
const Address = require("../models/Address");
const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

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
    },
    resolve(parents, args) {
      return User.findOneAndUpdate(
        { id: args.id },
        {
          $set: {
            name: args.name,
            email: args.email,
            address: args.address,
            unitNumber: args.unitNumber,
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
      address: { type: GraphQLID },
      author: { type: GraphQLString },
    },
    async resolve(parents, args) {
      const lastIdNumber = await BlogPost.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      return new BlogPost({
        id: lastIdNumber + 1,
        author: args.author,
        title: args.title,
        message: args.message,
        address: args.address,
      }).save();
    },
  },
  upVotePost: {
    type: BlogPostType,
    args: { postId: { type: GraphQLID }, userId: { type: GraphQLID } },
    async resolve(parents, args) {
      const isUpvoted = await BlogPost.findOne({
        id: args.postId,
      }).then((res) => res.upVote.includes(args.userId));
      // const isDownVoted = await BlogPost.findOne({
      //   id: args.postId,
      // }).then((res) => res.downVote.includes(args.userId));

      if (isUpvoted) {
        return await BlogPost.findOneAndUpdate(
          { id: args.postId },
          {
            $pull: {
              upVote: args.userId,
            },
            // $inc: {
            //   votesCount: -1,
            // },
          },
          { new: true }
        );
      } else {
        return await BlogPost.findOneAndUpdate(
          { id: args.postId },
          {
            $pull: {
              downVote: args.userId,
            },
            $push: {
              upVote: args.userId,
            },
            // $inc: {
            //   votesCount: isDownVoted ? +2 : +1,
            // },
          },
          { new: true }
        );
      }
    },
  },
  downVotePost: {
    type: BlogPostType,
    args: { postId: { type: GraphQLID }, userId: { type: GraphQLID } },
    async resolve(parents, args) {
      //IF USER HIT DOWNVOTE, CHECKING IF HE HAD UPVOTED BEFORE IF SO REMOVING IT
      const isDownVoted = await BlogPost.findOne({
        id: args.postId,
      }).then((res) => res.downVote.includes(args.userId));
      // const isUpvoted = await BlogPost.findOne({
      //   id: args.postId,
      // }).then((res) => res.upVote.includes(args.userId));

      if (isDownVoted) {
        return await BlogPost.findOneAndUpdate(
          { id: args.postId },
          {
            $pull: {
              downVote: args.userId,
            },
            // $inc: {
            //   votesCount: +1,
            // },
          },
          { new: true }
        );
      } else {
        return await BlogPost.findOneAndUpdate(
          { id: args.postId },
          {
            $pull: {
              upVote: args.userId,
            },
            $push: {
              downVote: args.userId,
            },
            // $inc: {
            //   votesCount: isUpvoted ? -2 : -1,
            // },
          },
          { new: true }
        );
      }
    },
  },
  addComment: {
    type: CommentType,
    args: {
      postId: { type: GraphQLID },
      userId: { type: GraphQLID },
      message: { type: GraphQLString },
      replyId: { type: GraphQLID },
    },
    async resolve(parents, args) {
      const lastIdNumber = await Comment.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );

      const newComment = await new Comment({
        id: lastIdNumber + 1,
        message: args.message,
        author: args.userId,
        postId: args.postId,
        replyId: args.replyId,
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

module.exports = {
  userMutations,
  countryMutations,
  provinceMutations,
  cityMutations,
  addressMutations,
  blogPostMutations,
};
