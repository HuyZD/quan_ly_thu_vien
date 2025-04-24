import React, { useEffect, useState } from "react";
import {
  BASE_URL,
  addNewStudent,
  deleteStudent,
  exportStudents,
  getAllStudents,
  updateStudent,
} from "../../../http";
import profileImage from "../../../assets/avatar.svg";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Modal, Pagination } from "../../../components";
import { Link, useNavigate } from "react-router-dom";

const ManageStudent = () => {
  const [query, setQuery] = useState({ email: "", name: "", rollNumber: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const navigate = useNavigate();
  const initialState = {
    _id: "",
    name: "",
    email: "",
    rollNumber: "",
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
    const promise = addNewStudent({
      name: formData.name,
      email: formData.email,
      rollNumber: formData.rollNumber,
    });
    toast.promise(promise, {
      loading: "Đang lưu...",
      success: (data) => {
        setFormData(initialState);
        fetchData();
        setShowAddNewModel(false);
        return "Thêm sinh viên thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleDelete = (_id) => {
    const promise = deleteStudent(_id);
    toast.promise(promise, {
      loading: "Đang xóa...",
      success: (data) => {
        fetchData();
        return "Xóa sinh viên thành công..";
      },
      error: (err) => {
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateStudent(formData?._id, {
      name: formData.name,
      email: formData.email,
      rollNumber: formData.rollNumber,
      accountStatus: formData.accountStatus,
    });
    toast.promise(promise, {
      loading: "Đang cập nhật...",
      success: (data) => {
        setFormData(initialState);
        fetchData();
        setShowUpdateModel(false);
        return "Cập nhật sinh viên thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleExport = () => {
    const promise = exportStudents();
    toast.promise(promise, {
      loading: "Exporting...",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Students Exported successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllStudents(
        query.email,
        query.name,
        query.rollNumber,
        currentPage
      );
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
      fetchData();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Quản lý sinh viên</h2>
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
          placeholder="Tìm kiếm theo số điện thoại...."
          className="background__accent text"
          value={query.rollNumber}
          onChange={(e) => {
            setQuery({ ...query, rollNumber: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          className="background__accent text"
          value={query.name}
          onChange={(e) => {
            setQuery({ ...query, name: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo email...."
          className="background__accent text"
          value={query.email}
          onChange={(e) => {
            setQuery({ ...query, email: e.target.value });
          }}
        />
        <button
          className="btn btn__primary"
          onClick={() => {
            setQuery({ email: "", name: "", rollNumber: "" });
          }}
        >
          XÓA
        </button>
      </div>

      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>Số điện thoại</td>
              <td>Ảnh đại diện</td>
              <td>Tên</td>
              <td>Email</td>
              <td>Tùy chỉnh</td>
            </tr>
          </thead>
          <tbody>
            {data?.students?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i.rollNumber}</td>
                  <td>
                    <img
                      src={
                        i.imagePath
                          ? `${BASE_URL}/${i.imagePath}`
                          : profileImage
                      }
                      alt="avatar"
                      className="avatar"
                    />
                  </td>
                  <td>{i.name}</td>
                  <td>{i.email}</td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => {
                          navigate(`/admin/dashboard/user-details/${i._id}`);
                        }}
                        className="btn btn__success"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn__warning"
                        onClick={() => {
                          setFormData({
                            _id: i._id,
                            name: i.name,
                            email: i.email,
                            rollNumber: i.rollNumber,
                          });
                          setShowUpdateModel(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn__danger"
                        onClick={() => {
                          handleDelete(i._id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
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

      <Modal
        title="Thêm sinh viên mới"
        show={showAddNewModel}
        onClose={handleCloseAddNewModel}
      >
        <form onSubmit={handleAddNew}>
          <div className="form-control">
            <label htmlFor="name">Tên sinh viên</label>
            <input
              type="text"
              placeholder="Nhập tên sinh viên"
              name="name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          

          <div className="form-control">
            <label htmlFor="rollNumber">Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              name="rollNumber"
              className="bg text__color"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              name="email"
              className="bg text__color"
              value={formData.email}
              onChange={handleChange}
              required
            />
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

      {/* UPDATE ALMIRAH FORM */}
      <Modal
        title="UPDATE STUDENT"
        show={showUpdateModel}
        onClose={handleCloseUpdateModel}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-control">
            <label htmlFor="name">Tên sinh viên</label>
            <input
              type="text"
              placeholder="Nhập tên sinh viên"
              name="name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="rollNumber">Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              name="rollNumber"
              className="bg text__color"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              name="email"
              className="bg text__color"
              value={formData.email}
              onChange={handleChange}
              required
            />
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

export default ManageStudent;
