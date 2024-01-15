import { useForm } from "react-hook-form";
import { Modal } from "antd";
import React, { useState } from "react";
import * as HttpServices from "../service/Service"
import { useNavigate } from "react-router-dom";
import {Spin } from "antd";
// import Login from "./Login";
import { TiTick } from "react-icons/ti";
const CustomerID = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    setVisible(false);
  };
  const showErrorModal = () => {
    Modal.error({
      title: "Error",
      content: "Please Enter Valid Customer ID",
      centered: true,
      okButtonProps: {
        style: {
          backgroundColor: "#ff4d4f",
          borderColor: "#ff4d4f",
        },
      },
    });
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      let CustomerId = await HttpServices.Customers(data);
      if (CustomerId?.data?.Available === 'Yes') {
        navigate("/Login")
        setLoading(false)
      } else {
        showErrorModal();
        setLoading(false)
      }
    } catch (errors) {
      console.log({ errors })
    }
    reset();
  };
  return (
    <>
     <Spin spinning={loading}>
      <div className="container">
        <div className="login-section">
          <div className="login-container">
            <div>
              <h4 className="logo-text">BPalSoftTech</h4>
              <form
                className="login-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <p>Sign in to start your session</p>
                <div>
                  <input
                    type="text"
                    name="customerid"
                    placeholder="Customer ID"
                    {...register("customerid", { required: true })}
                  ></input>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button>
                    check <TiTick style={{ fontSize: "20px" }} />
                  </button>
                </div>
              </form>
              <Modal show={visible} onOk={handleOk}></Modal>
            </div>
          </div>
        </div>
      </div>
      </Spin>
    </>
  );
};

export default CustomerID;
