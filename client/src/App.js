import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "https://testauthql.herokuapp.com/graphql",
  cache,
  cors: {
    origin: [
      "https://test-auth-356806.uc.r.appspot.com",
      "https://studio.apollographql.com",
    ],
  },
});

function App() {
  const [token, setToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  useEffect(() => {
    const refresh =
      token &&
      setInterval(() => {
        console.log("tokenRefreshed");
      }, 7500);
    return () => {
      clearInterval(refresh);
    };
  }, [token, tokenExpiration]);

  console.log(tokenExpiration);
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setTokenExpiration(user.expiresIn);
    }
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route
                path="/signUp"
                element={
                  !token ? (
                    <Register setToken={setToken} />
                  ) : (
                    <Navigate replace to="/" />
                  )
                }
              />
              <Route
                path="/signIn"
                element={
                  !token ? (
                    <Signin setToken={setToken} />
                  ) : (
                    <Navigate replace to="/" />
                  )
                }
              />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route
                path="/"
                element={
                  !token ? (
                    <Navigate replace to="/signIn" />
                  ) : (
                    <Home setToken={setToken} />
                  )
                }
              />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
