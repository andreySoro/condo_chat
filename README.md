# MANY HATS FIREBASE BACKEND TEMPLATE

## setup instructions

- generate firebase project
- turn on [authentication](https://console.firebase.google.com/project/_/authentication/providers)
- create [web project](https://console.firebase.google.com/project/_/overview)
- go to [service accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) and click Generate new private key. Put the file into the root of the project, re-name the file `serviceAccountKey.json`
- create .env file in the root directory, add folowing variables, which can be found in firebase config file after creating web project.

```
**NODE_ENV**
 "development"
MONGO_URI ="your mongo db connection link"
FIREBASE_API_KEY="your key"
FIREBASE_AUTH_DOMAIN="your domain"
BASE_URL=https://identitytoolkit.googleapis.com/v1
```

- run `yarn` or `npm install` in the root of the project

- start server with `yarn dev` or `npm run dev`
