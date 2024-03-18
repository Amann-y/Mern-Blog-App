import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Adjust the number of products per page as needed
  const [productInfo, SetProductInfo] = useState({
    userName: "",
    userEmail: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searachItem, setSearchItem] = useState("");

  async function getProducts(signal) {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/get-products",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      setProducts(res.data.products);
      setLoading(false);
      SetProductInfo({
        userName: res.data.name,
        userEmail: res.data.email,
      });
    } catch (error) {
      console.log(error);
      toast.error("Oops! Something went wrong.");
    }
  }

  const deleteProduct = async (id) => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete-product/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.statusText === "OK") {
        toast.success(res.data.message);
        getProducts();
      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getProducts(signal);

    return () => {
      controller.abort();
    };
  }, []);

  const higherPriceSorting = async () => {
    try {
      const out = products
        ?.filter((ele) => parseInt(ele.price))
        .sort((a, b) => parseInt(b.price) - parseInt(a.price));

      setProducts(out);
    } catch (error) {
      console.log(error);
    }
  };

  const lowerPriceSorting = async () => {
    try {
      const out = products
        ?.filter((ele) => parseInt(ele.price))
        .sort((a, b) => parseInt(a.price) - parseInt(b.price));

      setProducts(out);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async () => {
    const token = JSON.parse(localStorage.getItem("user"));

    if (searachItem.trim() === "") {
      getProducts();
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/product/filter-by-category/${searachItem}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status >= 200 && response.status < 300) {
          const { output } = response.data;

          if (output && output.length > 0) {
            setProducts(output);
          } else {
            toast.info("No products found for the given search.");
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.info("No products found for the given search.");
        } else {
          console.log(error);
          toast.error("Oops! Something went wrong.");
        }
      }
    }
  };

  useEffect(() => {
    let searchId = setTimeout(() => {
      handleChange();
    }, 800);

    return () => {
      clearTimeout(searchId);
    };
  }, [searachItem]);

  const exportCSV = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/productsexport",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        window.open(res.data.downloadUrl, "blank");
        toast.success("CSV File Is Being Downloaded");
      } else {
        toast.error("Error Occurred");
      }
    } catch (error) {
      console.log(error);
      toast.error("Oops! Something went wrong.");
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="py-2 d-flex flex-column gap-1">
      <div className="container">
        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-items">
              <button
                className="btn text-primary nav-link"
                onClick={higherPriceSorting}
                title="High"
              >
                Price <i className="bi bi-arrow-up"></i>
              </button>
            </li>
            <li className="nav-items">
              <button
                className="btn text-primary nav-link"
                onClick={lowerPriceSorting}
                title="Low"
              >
                Price <i className="bi bi-arrow-down"></i>
              </button>
            </li>
            <li className="nav-items">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searachItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </li>
          </ul>
        </div>

        <div className="row mt-1 g-1 g-md-5">
          <h2 className="text-center mt-0 mb-md-4">Products</h2>
          {loading ? (
            <div className="d-flex align-items-center flex-column justify-content-center gap-1">
              <h1 className="fs-5" role="status">
                Loading...
              </h1>
              <div
                className="spinner-border d-flex justify-content-center"
                aria-hidden="true"
              ></div>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="container d-flex justify-content-center align-items-center fs-5">No Product</div>
          ) : (
            currentProducts.map((ele) => {
              return (
                <div
                  className="col-md-4 my-1 mb-3 mb-md-5 d-flex justify-content-center align-items-center"
                  key={ele._id}
                >
                  <div className="card my-card h-100">
                    <img
                      alt="..."
                      className="card-img-top"
                      src="https://cdn.pixabay.com/photo/2020/05/29/07/28/abstract-5234105_640.jpg"
                    />
                    <div className="card-body ">
                      <p className="card-text text-primary fs-4">
                        Name : {ele.name}
                      </p>
                      <h6>Price Rs: {ele.price}/only</h6>
                      <p className="card-text">Category : {ele.category}</p>
                      <p className="card-text">Manufacturer : {ele.company}</p>

                      {ele?.userInfo ? (
                        <div className="d-flex flex-column flex-wrap border-1 border-danger-subtle justify-content-center align-items-center gap-0 p-0 fs-6 fst-italic">
                          <p className="">Posted By :</p>
                          <p className="">
                            Name :{" "}
                            {ele.userInfo[0]?.name
                              ? ele.userInfo[0]?.name
                              : "No Detail Available"}
                          </p>
                          <p className="">
                            Email :{" "}
                            {ele.userInfo[0]?.email
                              ? ele.userInfo[0]?.email
                              : "No Detail Available"}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}

                      <i
                        className="bi bi-trash3 product_del_icon"
                        onClick={() => deleteProduct(ele._id)}
                        title="delete"
                      ></i>

                      <Link
                        className="product_edit_icon"
                        title="edit"
                        to={`/updateaproduct/${ele._id}`}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div className="col-md-12 mt-3">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                {Array.from(
                  { length: Math.ceil(products.length / productsPerPage) },
                  (_, index) => (
                    <li
                      key={index}
                      className={`page-item d-flex justify-content-center align-items-center gap-1 ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="div_csv">
        <button
          onClick={exportCSV}
          className="badge rounded-pill text-bg-primary"
        >
          Export To CSV
        </button>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Products;
