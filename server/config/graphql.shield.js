const { applyMiddleware } = require("graphql-middleware");
const { shield } = require("graphql-shield");
const { graphQlAuth } = require("../middleware/auth.check");
const schema = require("../schema/schema");

const permissions = shield(
  {
    RootQueryType: {
      getUsers: graphQlAuth,
      getUser: graphQlAuth,
      getCountries: graphQlAuth,
      getCountryByName: graphQlAuth,
      getProvinces: graphQlAuth,
      getProvincesCountrySpecific: graphQlAuth,
      getCities: graphQlAuth,
      getCityByProvinceId: graphQlAuth,
      autocompleteCity: graphQlAuth,
      getAddresses: graphQlAuth,
      autocompleteAddress: graphQlAuth,
      getBlogPostsByAddress: graphQlAuth,
      getBlogPostById: graphQlAuth,
      getCommentsByBlogPostId: graphQlAuth,
      getAllTags: graphQlAuth,
      getUsersForGivenAddress: graphQlAuth,
      getBlogPostByUserId: graphQlAuth,
    },
    RootMutationType: {
      updateUserInfo: graphQlAuth,
      addCountry: graphQlAuth,
      getAllCountries: graphQlAuth,
      addProvince: graphQlAuth,
      addCity: graphQlAuth,
      createAddress: graphQlAuth,
      addBlogPost: graphQlAuth,
      upVotePost: graphQlAuth,
      downVotePost: graphQlAuth,
      addComment: graphQlAuth,
      deleteComment: graphQlAuth,
      addTag: graphQlAuth,
      reportBlogPost: graphQlAuth,
    },
  },
  {
    allowExternalErrors: true,
  }
);
const schemaWithPermissions = applyMiddleware(schema, permissions);

module.exports = { schemaWithPermissions };
