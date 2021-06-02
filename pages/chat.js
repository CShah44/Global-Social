import { Fragment } from "react";
import Sidebar from "../components/Chat/Sidebar";
import Header from "../components/Header";

function chat() {
  return (
    <Fragment>
      <Header />
      <div className="d-flex" style={{ height: "100vh" }}>
        <Sidebar />
      </div>
    </Fragment>
  );
}

export default chat;
