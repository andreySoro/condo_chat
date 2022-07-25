import React from "react";
import Clients from "../components/Clients";
import AddClient from "../components/AddClient";
import Projects from "../components/Projects";

function Home({ setToken }) {
  return (
    <>
      <div className="d-flex gap-3 mb-3">
        <AddClient setToken={setToken} />
      </div>
      <Projects />
      <Clients />
    </>
  );
}

export default Home;
