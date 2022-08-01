import React from "react";
import Clients from "../components/Clients";
import AddClient from "../components/AddClient";
import Projects from "../components/Projects";
import AddProject from "../components/AddProject";
import SignOut from "../components/SignOut";

function Home({ setToken }) {
  return (
    <>
      <div className="d-flex mb-3 justify-content-between">
        <span>
          <AddClient />
          <AddProject />
        </span>
        <span>
          <SignOut setToken={setToken} />
        </span>
      </div>
      <Projects />
      <div style={{ minHeight: "125px" }}>
        <Clients />
      </div>
    </>
  );
}

export default Home;
