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
  const [userform, setUserform] = useState(false);
  const onSubmit = async (data) => {
    const value = {
      method: "login",
      data: {
        ...data,
      },
    };
    const jsonString = JSON.stringify(value);
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
        setUserform(true);
      } else {
        showErrorModal();
      }

      if (userform === true && res.Available === "Yes") {
        const products = await axios.post(
          `http://106.51.2.145:2081/Dlite_Kot/Service1.svc/webreport`,
          {
            jsonString,
          }
        );
        console.log("products", products);
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
              {!userform ? (
                <div>
                  <input
                    type="text"
                    name="customerid"
                    placeholder="Customer ID"
                    {...register("customerid", { required: true })}
                  ></input>
                </div>
              ) : (
                <>
                  <div>
                    <input
                      type="text"
                      name="customerid"
                      placeholder="Customer ID"
                      {...register("customerid", { required: true })}
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
                </>
              )}
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
