import axios from "axios";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    // watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log("data", { ...data });
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
                  name="UserName"
                  placeholder="User Name"
                  {...register("UserName", { required: true })}
                ></input>
                {errors.example && <p>{errors.example.message}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="Password"
                  placeholder="Password"
                  {...register("Password", { required: true })}
                ></input>
                {errors.example && <p>{errors.example.message}</p>}
              </div>
              <div>
                <button>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
