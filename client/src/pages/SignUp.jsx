import React, { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignUp = ({ setFlag }) => {
  const {
    register,
    watch,
    handleSubmit,
    isSubmitting,
    formState: { errors },
    setError,
    resetField,
    reset,
  } = useForm();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      setFlag(true);
      navigate("/");
    }
  }, []);

  const onSubmit = async (data) => {
    let id;
    if (id) {
      clearTimeout(id);
    }
    setIsButtonDisabled(true); // Disable the button
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        data
      );

      if (res.status === 200 || res.statusText == "OK") {
        localStorage.setItem("user", JSON.stringify(res.data.user.token));
        resetField("name");
        resetField("email");
        resetField("password");
        toast.success(res.data.message);
        setFlag(true);
        id = setTimeout(() => {
          setIsButtonDisabled(false);
          navigate("/");
        }, 2000);
      } else {
        setError("myform", { message: "Ops Something Went Wrong" });
        toast.error("Oops! Something went wrong.");
        setIsButtonDisabled(false); // Enable the button on error
      }
    } catch (error) {
      setError("myform", { message: "Ops Something Went Wrong" });
      toast.error(error.response.data.error);
      resetField("name");
      resetField("email");
      resetField("password");
      reset();
      setIsButtonDisabled(false); // Enable the button on error
    }
  };

  return isSubmitting ? (
    <div class="spinner-border text-light" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  ) : (
    <>
      <div className="container py-1">
        <h1 className="fs-2">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="exampleInputText1" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputText1"
              aria-describedby="emailHelp"
              {...register("name", {
                required: { value: true, message: "This Field Is Required" },
                minLength: {
                  value: 3,
                  message: "Minimum Length Of Name Should 3",
                },
                maxLength: {
                  value: 20,
                  message: "Maximum Length Of Name Should 20",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              {...register("email", {
                required: { value: true, message: "This Field Is Required" },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              {...register("password", {
                required: { value: true, message: "This Field Is Required" },
                minLength: {
                  value: 3,
                  message: "Minimum Length Of Password Should 3",
                },
                maxLength: {
                  value: 10,
                  message: "Maximum Length Of Password Should 10",
                },
              })}
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isButtonDisabled}
          >
            Register
          </button>
          {errors.myform && (
            <div className="my-2 text-danger fw-semibold">
              {errors.myform.message}
            </div>
          )}
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignUp;
