import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { BrowserRouter as Redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Register({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [color, setColor] = useState("#0275d8");
  const [formError, setFormError] = useState(false);
  const [regStatus, setRegStatus] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const timeOut =
      formError &&
      setTimeout(() => {
        setFormError(null);
      }, 5000);
    return () => clearTimeout(timeOut);
  }, [formError]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    try {
      const result = await axios.post("http://localhost:5000/signUp", {
        email,
        password,
        emailVerification: true,
      });
      console.log("RESULT AUTH", result);
      if (
        result.status === 200 &&
        (result.data.message === "User exists, email verified" ||
          result.data.message === "User exists, email verification turned off")
      ) {
        localStorage.setItem("token", result.data.user.idToken);
        setToken(result.data.user.idToken);
      } else {
        setRegStatus(true);
      }
      // localStorage.setItem("token", result.data.idToken);
      // setToken(result.data.idToken);
    } catch (error) {
      console.log("ERROR SIGN IN", error);
      setFormError(
        error?.response?.data?.error?.message === "User already exist."
          ? ("User already exist, try to sign in.", setRegStatus(true))
          : error?.response?.data?.error?.message
      );
    }

    // setEmail("");
    // setPassword("");
    // setConfirmPassword("");
  };

  const renderMainPage = () => {
    return (
      <div className="container" style={{ maxWidth: "650px" }}>
        <div className="text-center">
          <h2>Registration</h2>
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
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Confirm password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="form-control"
              id="exampleInputPassword2"
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
              <p style={{ color: "white", padding: 0, margin: 0 }}>
                {formError}
              </p>
            </div>
          )}
          <div className="text-center d-flex justify-content-center">
            <div className="mb-3 form-check d-flex">
              <p style={{ marginRight: "5px" }}>Already have an account?</p>
              <a href="/signIn">
                <p>Sign in</p>
              </a>
            </div>
          </div>

          {/* <div className="text-center d-flex justify-content-center"> */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              maxWidth: "650px",
              height: "45px",
            }}
          >
            Submit
          </button>

          {/* </div> */}
        </form>
      </div>
    );
  };
  const renderConfirmation = () => {
    return (
      <div className="container" style={{ maxWidth: "650px" }}>
        <div className="text-center">
          <h2>Registration</h2>
          <div className="mt-5">
            <Spinner />
          </div>
          <div className="text-center justify-content-center mt-5">
            <div className="mb-3 form-check">
              <p style={{ fontSize: "18px" }}>
                We have sent you notification to your email: {email}
              </p>
              <p style={{ fontSize: "18px" }}>
                Keep this page open to be automatically redirected.
                Alternatively, you can sign in later when you confirm it.
              </p>
              <button
                onClick={() => navigate("/signIn")}
                type="button"
                className="mt-2 btn btn-primary"
                style={{
                  width: "50%",
                  maxWidth: "650px",
                  height: "45px",
                }}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!regStatus && renderMainPage()}
      {regStatus && renderConfirmation()}
    </>
  );
}

export default Register;
