import CustomerID from "../customer/CustomerID"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../login/Login";
import Dashboard from "../dashboard/Dashboard";
const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerID />}>
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>


  )
}

export default Router;