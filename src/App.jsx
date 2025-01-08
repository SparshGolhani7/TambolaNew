import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Component/Navbar";
import Housie from "./Component/Housie";
import Master from "./Component/Master";
import { useState } from "react";

function App() {
  // const [isGameStarted,setisGameStarted] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [isWinner, setIsWinner] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Housie />}></Route>
          <Route path="/admin" element={<Master />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
