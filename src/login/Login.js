import { useForm } from "react-hook-form";
import { Modal } from "antd";
import React, { useState } from "react";
import { FaUser, FaLock, FaArrowCircleRight } from "react-icons/fa";
import * as HttpServices from "../service/Service";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
const Login = () => {
  const [loading, setLoading] = useState(false);
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
      content: "Invalid username or password",
      centered: true,
      okButtonProps: {
        style: {
          backgroundColor: "#ff4d4f",
          borderColor: "#ff4d4f",
        },
      },
    });
  };
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const value = {
        method: "login",
        data: {
          ...data,
        },
      };
      let userInfo = await HttpServices.user(value);
      // console.log("userInfo", userInfo);
      if (
        userInfo.status === 200 &&
        userInfo?.data?.status_result !== "In-Correct password" &&
        userInfo?.data?.status_result !== "User not found"
      ) {
        localStorage.setItem(
          "data",
          JSON.stringify(userInfo?.data?.status_result?.data)
        );
        // showsuccessModal();
        navigate("/Dashboard");
        setLoading(false);
      } else {
        showErrorModal();
        setLoading(false);
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
      <Spin spinning={loading} tip="Loading...">
        <div className="container">
          <div className="login-section">
            <div className="login-container">
              <div>
                <h4 className="logo-text">BPalSoftTech</h4>
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                  <p>Sign in to start your session</p>
                  <div className="user-input-section">
                    <FaUser />
                    <input
                      type="text"
                      name="UserName"
                      placeholder="UserName"
                      {...register("userid", { required: true })}
                    ></input>
                  </div>
                  <div className="password-input-section">
                    <FaLock />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      {...register("password", { required: true })}
                    ></input>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button>
                      Submit <FaArrowCircleRight />
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

export default Login;
