import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [userData, setUserData] = useState("");
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });

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

  const getUserDetail = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/loggeduser",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 200) {
        setUserData(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const onSubmit = async (data) => {
    // Get the token from localStorage
    const token = JSON.parse(localStorage.getItem("user"));
    setIsButtonDisabled(true); // Disable the button
    try {
      if (data.password !== data.password_confirmation) {
        setError("myform", {
          message: "Password & Confirm Password Don't Match",
        });
        toast.error("Password & Confirm Password Don't Match");
        resetField("password");
        resetField("password_confirmation");
        reset();
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/changepassword",
          data,
          {
            headers: {
              authorization: `Bearer ${token}`,
              // Add other headers if needed
            },
          }
        );
        if (res.status === 200 || res.statusText == "OK") {
          toast.success(res.data.message);
          resetField("password");
          resetField("password_confirmation");
          reset();
          setIsButtonDisabled(false);
        } else {
          toast.error("Oops! Something went wrong.");
          setIsButtonDisabled(false); // Enable the button on error
        }
      }
    } catch (error) {
      toast.error(error.response.data.error);
      resetField("password");
      resetField("password_confirmation");
      reset();
      setIsButtonDisabled(false); // Enable the button on error
    }
  };

  return (
    <div className="container outer_profile_div">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#845ec2"
          fillOpacity="1"
          d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,229.3C672,245,768,235,864,202.7C960,171,1056,117,1152,128C1248,139,1344,213,1392,250.7L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between gap-2">
        <div className="card profile_card_1">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            className="card-img-top"
            alt="..."
          />
        </div>
        <div className="mb-3 d-none d-lg-block">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Choose Image
          </label>
          <input
            type="file"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <button type="submit" className="btn btn-primary mt-2">
            Submit
          </button>
        </div>
        <div className="card profile_card_2 px-1 py-1">
          <h3 className="text-center">User Details</h3>
          <h4>Name : {userData?.name}</h4>
          <div className="d-flex flex-column align-items-center ">
            <h5>Email</h5>
            <h5>{userData?.email}</h5>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Click To Change Password
          </button>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Change Password
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        {...register("password", {
                          required: {
                            value: true,
                            message: "This Field Is Required",
                          },
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
                    </div>
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}

                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword2"
                        className="form-label"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        {...register("password_confirmation", {
                          required: {
                            value: true,
                            message: "This Field Is Required",
                          },
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
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-danger">
                        {errors.password_confirmation.message}
                      </p>
                    )}

                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
