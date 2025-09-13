import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navbar from "./Pages/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Signin from "./Pages/Signin/Signin";
import { useEffect, useState } from "react";
import Otp from "./Pages/Otp/Otp"

function App() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const status = false;
    setLogin(status);
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar setLogin={setLogin} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route
            path="/"
            element={<Login login={login} setLogin={setLogin} />}
          />
          <Route path="/signup" element={<Signin />} />
          <Route path="/otp" element={<Otp/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
