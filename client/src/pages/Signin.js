import axios from "axios";
import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

function Signin({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const timeOut =
      formError &&
      setTimeout(() => {
        console.log("INSIDE TIMEOUT");
        setFormError(null);
      }, 5000);
    return () => clearTimeout(timeOut);
  }, [formError]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:5000/signIn",
        // "https://testauthql.herokuapp.com/signIn",
        {
          email,
          password,
        }
      );
      console.log("USER", result);
      localStorage.setItem("token", result.data.accessToken);
      setToken(result.data.accessToken);
    } catch (error) {
      setFormError(error?.response?.data?.error?.message || error?.message);
    }

    // setEmail("");
    // setPassword("");
  };

  return (
    <div className="container" style={{ maxWidth: "650px" }}>
      <div className="text-center">
        <h2>Sign in</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text"></div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        {formError && (
          <div
            className="text-center d-flex align-items-center justify-content-center bg-danger mb-3"
            style={{
              width: "100%",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            <p style={{ color: "white", padding: 0, margin: 0 }}>{formError}</p>
          </div>
        )}
        <div className="text-center d-flex justify-content-center">
          <div className="mb-3 form-check d-flex">
            <p style={{ marginRight: "5px" }}>Don't have an account?</p>
            <a href="/signUp">
              <p>Sign up</p>
            </a>
          </div>
        </div>
        <div className="text-center d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", maxWidth: "650px", height: "45px" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signin;
