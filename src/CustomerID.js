import axios from "axios";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import React, { useState } from "react";
import Login from "./Login";
import { TiTick } from "react-icons/ti";
const CustomerID = () => {
  const { register, handleSubmit, reset } = useForm();
  const [visible, setVisible] = useState(false);
  const handleOk = () => {
    setVisible(false);
  };
  // handle success Model
  // const showsuccessModal = () => {
  //   Modal.success({
  //     title: "SUCCESS",
  //     content: "LOGGED IN",
  //     centered: true,
  //     okButtonProps: {
  //       style: {
  //         backgroundColor: "#ff5500",
  //         borderColor: "#ff5500",
  //       },
  //     },
  //   });
  // };
  // handle Error Model
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
  const [userform, setUserform] = useState(false);
  const onSubmit = async (data) => {
    try {
      const res = await axios
        .post(
          `https://bpartner.in/personal/bpartner/imeilogger/getipaddress.php`,
          {
            ...data,
          }
        )
        .then((data) => data)
        .then((response) => response?.data);
      if (res.Available === "Yes") {
        setUserform(!userform);
      } else {
        showErrorModal();
      }
    } catch (errors) {
      if (errors) {
        showErrorModal();
      }
    }
    reset();
  };
  return (
    <>
      {!userform ? (
        <>
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
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default CustomerID;
