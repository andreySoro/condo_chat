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

module.exports = {
  AreaType,
  UserType,
  ProvinceType,
  CountryType,
  CityType,
  AddressType,
};
