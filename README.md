<a href="https://www.wewearmanyhats.com" target="_blank"><img style="with: 75px; height: 75px" alt="Company Logo" src="./assets/logo.png">
</a>

# FIREBASE BACKEND TEMPLATE

### Setup instructions

- generate firebase project
- turn on [authentication](https://console.firebase.google.com/project/_/authentication/providers)
- create [web project](https://console.firebase.google.com/project/_/overview)
- go to [service accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) and click Generate new private key. Put generated file into the root of the project, re-name it to `serviceAccountKey.json`
- create .env file in the root directory, add folowing variables, which can be found in firebase config file after creating web project

```
NODE_ENV="development"
MONGO_URI ="your mongo db connection link"
FIREBASE_API_KEY="your key"
FIREBASE_AUTH_DOMAIN="your domain"
BASE_URL="https://identitytoolkit.googleapis.com/v1"
```

- run `yarn` or `npm install` in the root of the project

- start the server with `yarn dev` or `npm run dev`

### What's used

- NodeJs <a href="https://nodejs.org/en/" target="_blank"><img style="height: 20px" alt="nodejs" src="./assets/node.png" ></a>
- Firebase (admin sdk and google rest API) <a href="https://firebase.google.com/" target="_blank"><img style="height: 20px" alt="firebase" src="./assets/firebase.png" ></a>
- GraphQL (optional, could be removed from the project with no effect on firebase auth) <a href="https://graphql.org/" target="_blank"><img style="height: 20px" alt="graphql" src="./assets/graphql.png"></a>
- Axios <a href="https://axios-http.com/" target="_blank"><img style="height: 25px; width: 25px" alt="axios" src="./assets/axios.png"></a>

### Functionality

- Signup `/signUp`
  - when making api call from frontend along side with email and password could be passed `emailVerification: true` to enable it
- Signin `/signIn`
- Forgot password `/forgotPassword` (email link)
- Refresh Token `/refreshToken`
- Authentication middleware (checking accessToken validity, could be added to routes)

### GraphQL

- Default schema for graphql is created in `schema` folder (if you don't need GQL this could be deleted)
- Default mongoose models are created and located in `models` folder (can also be deleted and/or modified if necessary)
- In the index file of the project there is `app.use("graphql")` (depending on whether or not you want to use gql)
