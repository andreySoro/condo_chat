# MANY HATS FIREBASE BACKEND TEMPLATE

## setup instructions

- generate firebase project
- turn on [authentication](https://console.firebase.google.com/project/_/authentication/providers)
<!-- - create [web project](https://console.firebase.google.com/project/_/overview) -->
- go to [service accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) and click Generate new private key. Put the file into the root of the project, re-name the file `serviceAccountKey.json`
- create .env file in the root directory, add there your mongo db connection link as MONGO_URI, FIREBASE_API_KEY and FIREBASE_AUTH_DOMAIN as well as BASE_URL = `https://identitytoolkit.googleapis.com/v1`. All those will come from your created web project configuration. As a last step you need to add NODE_ENV = 'development'. Alternatively, you can remove that enviroment mentioning from the code and package.json.

- run `yarn or npm install` in the root of the project

- start server with `yarn dev or npm run dev`
