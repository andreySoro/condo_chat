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
BASE_URL="https://identitytoolkit.googleapis.com/v1"
```

- run `yarn` or `npm install` in the root of the project

- start server with `yarn dev` or `npm run dev`

### What's used

- NodeJs <a href="https://nodejs.org/en/" target="_blank"><img style="height: 20px" alt="nodejs" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white" ></a>
- Firebase (admin sdk and google rest API) <a href="https://firebase.google.com/" target="_blank"><img style="height: 20px" alt="firebase" src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" ></a>
- GraphQL (optional, could be removed from the project with no effect on firebase auth) <a href="https://graphql.org/" target="_blank"><img style="height: 20px" alt="graphql" src="https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white"></a>
- Axios <a href="https://axios-http.com/" target="_blank"><img style="height: 25px; width: 25px" alt="axios" src="https://avatars.githubusercontent.com/u/32372333?s=160&v=4"></a>

### Functionality

- Signup `/signUp`
  - when making api call from frontend along side with email and password could be passed `emailVerification: true` to enable it
- Signin `/signIn`
- Forgot password `/forgotPassword` (email link)
- Refresh Token `/refreshToken`
- Authentication middleware (checking accessToken validity, could be added to routes)
