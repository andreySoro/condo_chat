import axios from "axios";
import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const timeOut2 =
      formSuccess &&
      setTimeout(() => {
        setFormSuccess(null);
        navigate("/signIn");
      }, 3500);
    return () => clearTimeout(timeOut2);
  }, [formSuccess]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/forgotPassword", {
        email,
      });
      setFormSuccess(result.data.message);
      setEmail("");
      console.log("FORGOT PASSWORD SUCCESS RESULT", result);
    } catch (error) {
      setFormError(error?.response?.data?.error?.message || error?.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "650px" }}>
      <div className="text-center">
        <h2>Forgot password</h2>
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
        {formSuccess && (
          <div
            className="text-center d-flex align-items-center justify-content-center bg-success mb-3"
            style={{
              width: "100%",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            <p style={{ color: "white", padding: 0, margin: 0 }}>
              {formSuccess} <Spinner />
            </p>
          </div>
        )}
        <div className="text-center d-flex justify-content-center">
          <div className="form-check d-flex">
            <p style={{ marginRight: "5px" }}>Don't have an account?</p>
            <a href="/signUp">
              <p>Sign up</p>
            </a>
            <p style={{ marginLeft: "5px", marginRight: "5px" }}>or</p>
            <a href="/signIn">
              <p>Sign in</p>
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

export default ForgotPassword;
