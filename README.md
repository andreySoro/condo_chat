<img style="with: 75px; height: 75px" alt="Company Logo" src="https://wewearmanyhats.com/app/themes/p_tech/resources/assets/images/logo.svg">

# FIREBASE BACKEND TEMPLATE

### Setup instructions

- generate firebase project
- turn on [authentication](https://console.firebase.google.com/project/_/authentication/providers)
- create [web project](https://console.firebase.google.com/project/_/overview)
- go to [service accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) and click Generate new private key. Put the file into the root of the project, re-name the file `serviceAccountKey.json`
- create .env file in the root directory, add folowing variables, which can be found in firebase config file after creating web project.

```
NODE_ENV="development"
MONGO_URI ="your mongo db connection link"
FIREBASE_API_KEY="your key"
FIREBASE_AUTH_DOMAIN="your domain"
BASE_URL=https://identitytoolkit.googleapis.com/v1
```

- run `yarn` or `npm install` in the root of the project

- start server with `yarn dev` or `npm run dev`

### What's used

- NodeJs <img style="height: 20px" alt="nodejs" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white" >
- Firebase (admin sdk and google rest API) <img style="height: 20px" alt="nodejs" src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" >
- GraphQL (optional, could be removed from the project with no effect on firebase auth) <img style="height: 20px" alt="nodejs" src="https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white">

### Functionality

- Signup `/signUp`
  - when making api call from frontend along side with email and password could be passed `emailVerification: true` to enable it
- Signin `/signIn`
- Forgot password `/forgotPassword` (email link)
- Refresh Token `/refreshToken`
- Authentication middleware (checking accessToken validity, could be added to routes)
