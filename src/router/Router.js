import CustomerID from "../customer/CustomerID"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../login/Login";
import Dashboard from "../dashboard/Dashboard";
import SalesReport from "../report/SalesReport";
const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerID />}>
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/SalesReport" element={<SalesReport />} />
        </Routes>
      </BrowserRouter>
    </>


  )
}

export default Router;