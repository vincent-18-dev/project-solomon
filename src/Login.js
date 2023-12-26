import axios from "axios";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import React, { useState } from "react";
const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    // watch,
    // formState: { errors },
  } = useForm();
  const [visible, setVisible] = useState(false);
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
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://dummyjson.com/auth/login", {
        ...data,
      });
      if (res.status === 200) {
        showsuccessModal();
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
      <div className="container">
        <div className="login-section">
          <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  {...register("username", { required: true })}
                ></input>
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                ></input>
              </div>
              <div>
                <button>Submit</button>
              </div>
            </form>
            <Modal show={visible} onOk={handleOk}></Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
