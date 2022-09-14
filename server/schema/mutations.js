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
} = require("./typeDefenition");
const User = require("../models/User");
const Country = require("../models/Country");
const Province = require("../models/Provinces");
const City = require("../models/City");
const Address = require("../models/Address");
const BlogPost = require("../models/BlogPost");

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

//ADDRESS MUTATIONS
const addressMutations = {
  createAddress: {
    type: AddressType,
    args: {
      addressName: { type: GraphQLString },
      postalCode: { type: GraphQLString },
      city: { type: GraphQLID },
    },
    async resolve(parents, args) {
      const doesAddressExist = await Address.findOne({
        name: args.addressName,
      });
      if (doesAddressExist) {
        return doesAddressExist;
      }
      const lastIdNumber = await Address.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      return new Address({
        id: lastIdNumber + 1,
        addressName: args.addressName,
        postalCode: args.postalCode,
        city: args.city,
      }).save();
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
    },
    async resolve(parents, args) {
      const lastIdNumber = await BlogPost.find().then(
        (res) => res[res?.length - 1]?.id || 0
      );
      return new BlogPost({
        id: lastIdNumber + 1,
        title: args.title,
        message: args.message,
        comments: null,
        upVote: 0,
        downVote: 0,
        address: args.address,
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
};
