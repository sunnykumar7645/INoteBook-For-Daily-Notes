import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import About from "./component/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./component/Alert";
import Signin from "./component/Signin";
import Signup from "./component/Signup";
const App = () => {
  return (
    <>
      <NoteState>
        <BrowserRouter>
          <Navbar />
          <Alert message="My First react app." />
          <div className="container">
            <Routes>
              <Route  path="/" element={<Home />} />
            </Routes>
            <Routes>
              <Route  path="/about" element={<About />} />
            </Routes>
            <Routes>
              <Route  path="/signup" element={<Signup />} />
            </Routes>
            <Routes>
              <Route  path="/signin" element={<Signin />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </>
  );
};

export default App;
