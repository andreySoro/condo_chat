const { applyMiddleware } = require("graphql-middleware");
const { shield } = require("graphql-shield");
const { graphQlAuth } = require("../middleware/auth.check");
const schema = require("../schema/schema");

const permissions = shield({
  RootQueryType: {
    getUser: graphQlAuth,
  },
  RootMutationType: {
    updateUserInfo: graphQlAuth,
  },
});
const schemaWithPermissions = applyMiddleware(schema, permissions);

module.exports = { schemaWithPermissions };
