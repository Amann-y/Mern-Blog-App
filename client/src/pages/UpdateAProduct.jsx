import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const UpdateAProduct = () => {
  const {
    register,
    watch,
    handleSubmit,
    isSubmitting,
    formState: { errors },
    setError,
    resetField,
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { id } = useParams();

  async function fetchDataOfProductById(id) {
    try {
      // Get the token from localStorage
      const token = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(
        `http://localhost:8000/api/v1/product/get-single-product/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            // Add other headers if needed
          },
        }
      );

      if (res.status == 200 || res.statusText == "OK") {
        // Use setValue to update the form values
        setValue("name", res.data?.output?.name);
        setValue("price", res.data?.output?.price);
        setValue("category", res.data?.output?.category);
        setValue("company", res.data?.output?.company);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDataOfProductById(id);
  }, [id]);

  const onSubmit = async (data) => {
    let timeoutid;
    if (timeoutid) {
      clearTimeout(timeoutid);
    }
    setIsButtonDisabled(true); // Disable the button
    try {
      // Get the token from localStorage
      const token = JSON.parse(localStorage.getItem("user"));

      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update-product/${id}`,

        data,
        {
          headers: {
            authorization: `Bearer ${token}`,
            // Add other headers if needed
          },
        }
      );

      if (res.status === 200 || res.statusText == "OK") {
        resetField("name");
        resetField("price");
        resetField("category");
        resetField("company");
        toast.success("Data Updated Successfully");
        // setFlag(true);
        timeoutid = setTimeout(() => {
          setIsButtonDisabled(false);
          navigate("/products");
        }, 2000);
      } else {
        setError("myform", { message: "Ops Something Went Wrong" });
        toast.error("Oops! Something went wrong.");
        setIsButtonDisabled(false); // Enable the button on error
      }
    } catch (error) {
      setError("myform", { message: "Ops Something Went Wrong" });
      toast.error("Oops! Something went wrong.");
      resetField("name");
      resetField("price");
      resetField("category");
      resetField("company");
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
        <h1 className="fs-2">Update A Product</h1>
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
                  value: 25,
                  message: "Maximum Length Of Name Shouldn't Be More Than 25",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPrice1" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control"
              id="exampleInputPrice1"
              aria-describedby="emailHelp"
              {...register("price", {
                required: "This Field Is Required",
                min: {
                  value: 1,
                  message: "Price must be greater than 0",
                },
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Invalid price format. Use up to 2 decimal places.",
                },
              })}
            />
            {errors.price && (
              <p className="text-danger">{errors.price.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputCategory1" className="form-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputCategory1"
              {...register("category", {
                required: { value: true, message: "This Field Is Required" },
                minLength: {
                  value: 3,
                  message: "Minimum Length Of Category Should 3",
                },
                maxLength: {
                  value: 25,
                  message: "Maximum Length Of Category Should 25",
                },
              })}
            />
            {errors.category && (
              <p className="text-danger">{errors.category.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputCompany1" className="form-label">
              Company
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputCompany1"
              {...register("company", {
                required: { value: true, message: "This Field Is Required" },
                minLength: {
                  value: 3,
                  message: "Minimum Length Of Company Should 3",
                },
                maxLength: {
                  value: 25,
                  message: "Maximum Length Of Company Should 25",
                },
              })}
            />
            {errors.company && (
              <p className="text-danger">{errors.company.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isButtonDisabled}
          >
            Update A Product
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

export default UpdateAProduct;
