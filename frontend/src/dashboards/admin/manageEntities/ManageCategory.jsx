import React, { useEffect, useState } from "react";
import {
  addNewCategory,
  exportCategories,
  getAllCategories,
  updateCategory,
} from "../../../http";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Modal, Pagination } from "../../../components";

const ManageCategory = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);

  const initialState = {
    _id: "",
    name: "",
    description: null,
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseAddNewModel = () => {
    setShowAddNewModel(false);
    setFormData(initialState);
  };

  const handleCloseUpdateModel = () => {
    setShowUpdateModel(false);
    setFormData(initialState);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const promise = addNewCategory({
      name: formData.name,
      description: formData.description,
    });
    toast.promise(promise, {
      loading: "Saving...",
      success: (data) => {
        setFormData(initialState);
        fetchCategoires();
        setShowAddNewModel(false);
        return "Category added successfully..";
      },
      error: (err) => {
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateCategory(formData?._id, {
      name: formData.name,
      description: formData.description,
    });
    toast.promise(promise, {
      loading: "Đang tải lên...",
      success: (data) => {
        setFormData(initialState);
        fetchCategoires();
        setShowUpdateModel(false);
        return "Thể loại sách đã cập nhật.";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const handleExport = () => {
    const promise = exportCategories();
    toast.promise(promise, {
      loading: "Exporting",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Exported successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const fetchCategoires = async () => {
    try {
      const { data } = await getAllCategories(query, currentPage);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setCurrentPage(1);
    // debouncing
    const handler = setTimeout(() => {
      fetchCategoires();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    fetchCategoires();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Quản lý thể loại sách</h2>
        <div>
          <button
            className="btn btn__secondary"
            onClick={() => {
              setShowAddNewModel(true);
            }}
          >
            Thêm mới
          </button>
         
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Tìm kiếm theo thể loại...."
          className="background__accent text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button
          className="btn btn__primary"
          onClick={() => {
            setQuery("");
          }}
        >
          XÓA
        </button>
      </div>

      <div className="table__wrapper">
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ID</td>
              <td>Tên</td>
              <td>Mô tả</td>
              <td>Tùy chỉnh</td>
            </tr>
          </thead>
          <tbody>
            {data?.categories?.map((category, index) => {
              return (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    {/* <button className="btn btn__success">
                      <FaEye />
                    </button> */}
                    <button
                      className="btn btn__warning"
                      onClick={() => {
                        setFormData({
                          name: category.name,
                          description: category.description,
                          _id: category._id,
                        });
                        setShowUpdateModel(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    {/* <button className="btn btn__danger">
                      <FaTrash />
                    </button> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={data}
      />

      {/* ADD NEW CATEGORY FORM */}
      <Modal
        title="Thêm thể loại sách"
        show={showAddNewModel}
        onClose={handleCloseAddNewModel}
      >
        <form onSubmit={handleAddNew}>
          <div className="form-control">
            <label htmlFor="name">Tên thể loại</label>
            <input
              type="text"
              placeholder="Nhập thể loại sách"
              name="name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Mô tả thể loại(Tùy chọn)</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="bg text__color"
            ></textarea>
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={handleCloseAddNewModel}
            >
              HỦY
            </button>
            <button type="submit" className="btn btn__success">
              THÊM
            </button>
          </div>
        </form>
      </Modal>

      {/* UPDATE CATEGORY FORM */}
      <Modal
        title="CẬP NHẬT THỂ LOẠI"
        show={showUpdateModel}
        onClose={handleCloseUpdateModel}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-control">
            <label htmlFor="name">Tên thể loại</label>
            <input
              type="text"
              placeholder="Nhập tên thể loại sách"
              name="name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Mô tả thể loại(Tùy chọn)</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="bg text__color"
            ></textarea>
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={handleCloseUpdateModel}
            >
              HỦY
            </button>
            <button type="submit" className="btn btn__success">
              CẬP NHẬT
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategory;
