import axios from "axios";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import React, { useState } from "react";
import { FaUser, FaLock, FaArrowCircleRight } from "react-icons/fa";
// import { useHistory } from 'react-router-dom';
import Burgermenu from "./dashboard/Dashboard";
const Login = () => {
  const { register, handleSubmit, reset } = useForm();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState("");
  const handleOk = () => {
    setVisible(false);
  };
  // handle success Model
  const showsuccessModal = () => {
    Modal.success({
      title: "SUCCESS",
      content: "LOGGED IN",
      centered: true,
      okButtonProps: {
        style: {
          backgroundColor: "#ff5500",
          borderColor: "#ff5500",
        },
      },
    });
  };
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
  //   const history = useHistory();
  const onSubmit = async (data) => {
    const value = {
      method: "login",
      data: {
        ...data,
      },
    };
    let items = JSON.stringify(value);
    try {
      const res = await axios
        .post(
          `http://106.51.2.145:2081/Dlite_Kot/Service1.svc/webreport`,
          items
        )
        .then((data) => data)
        .then((response) => response?.data?.status_result);
      console.log("res", res);
      if (res) {
        setItems(res);
        showsuccessModal();
        setOpen(true);
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
      {!open ? (
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
      ) : (
        <Burgermenu data={items} />
      )}
    </>
  );
};

export default Login;
