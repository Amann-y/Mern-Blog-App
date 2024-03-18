import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const [userEmail, setUserEmail] = useState("");
  const [freeze, setFreeze] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      return toast.error("Please Provide The Email");
    }
    setFreeze(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/send-reset-password-email`,
        { email: userEmail }
      );

      if (res.status == 200) {
        toast.success(res.data.message);
        setUserEmail("");
        setFreeze(false);
      } else {
        toast.error(res.response.data.error);
        setUserEmail("")
        setFreeze(false);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      setUserEmail("")
      setFreeze(false);
    }
  };

  return (
    <div className="container py-2">
      <div className="row flex-md-nowrap gap-3">
        <div className="col-12 col-md-4  ">
          <img
            src="/password.jpg"
            alt="forgot password pic"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-12 col-md-8 ">
          <h2>Forgot Password?</h2>
          <form className="mt-md-3" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={freeze ? true : false}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
