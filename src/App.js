// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Burgermenu from "./dashboard/Burgermenu";
// import Burgermenu from "./Burgermenu";
import CustomerID from "./CustomerID";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerID />}></Route>
          {/* <Route path="/dashboard" element={<Burgermenu />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
