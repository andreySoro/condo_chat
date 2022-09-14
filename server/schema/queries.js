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
} = require("./typeDefenition");
const User = require("../models/User");
const Provinces = require("../models/Provinces");
const Country = require("../models/Country");
const City = require("../models/City");
const Address = require("../models/Address");

//USER QUERIES
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

module.exports = {
  userQueries,
  provinceQueries,
  countryQueries,
  cityQueries,
  addressQueries,
};
