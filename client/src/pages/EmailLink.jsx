import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const EmailLink = () => {
  const data = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_Confirmation] = useState("");
  const [freeze, setFreeze] = useState(false);

  let timerId;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!password || !password_confirmation) {
        return toast.error("All Fields Are Required");
      } else {
        if (password !== password_confirmation) {
          return toast.error("Password & Confirm Password Don't Match");
        }
        setFreeze(true);
        const res = await axios.post(
          `http://localhost:8000/api/v1/user/reset-password/${data.id}/${data.token}`,
          { password, password_confirmation }
        );

        if (res.status == 200) {
          toast.success(res.data.message);
          setPassword("");
          setPassword_Confirmation("");
          setFreeze(false);
          timerId = setTimeout(() => {
            navigate("/login");
          }, 1200);
        } else {
          toast.error(res.response.data.error);
          setPassword("");
          setPassword_Confirmation("");
          setFreeze(false);
        }
      }
    } catch (error) {
      toast.error(error.response.data.error);
      setPassword("");
      setPassword_Confirmation("");
      setFreeze(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);
  return (
    <div className="container py-2">
      <h2 className="text-center">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword2" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            value={password_confirmation}
            onChange={(e) => setPassword_Confirmation(e.target.value)}
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
      <ToastContainer />
    </div>
  );
};

export default EmailLink;
