import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Component/Navbar";
import Housie from "./Component/Housie";
import Master from "./Component/Master";
import { useState } from "react";
import Multigame from "./Component/Multigame";

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
          <Route path="/multigame" element={<Multigame/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
