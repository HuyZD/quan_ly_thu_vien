import React, { useEffect, useState } from "react";
import {
  addNewAlmirah,
  exportAlmirahs,
  getAllAlmirahs,
  updateAlmirah,
} from "../../../http";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Modal, Pagination } from "../../../components";

const ManageAlmirah = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);

  const initialState = {
    _id: "",
    subject: "",
    number: "",
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
    const promise = addNewAlmirah({
      subject: formData.subject,
      number: formData.number,
    });
    toast.promise(promise, {
      loading: "Đang lưu...",
      success: (data) => {
        setFormData(initialState);
        fetchAlmirahs();
        setShowAddNewModel(false);
        return "Thêm tủ sách thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateAlmirah(formData?._id, {
      subject: formData.subject,
      number: formData.number,
    });
    toast.promise(promise, {
      loading: "Updating...",
      success: (data) => {
        setFormData(initialState);
        fetchAlmirahs();
        setShowUpdateModel(false);
        return "Cập nhật tủ sách thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleExport = () => {
    const promise = exportAlmirahs();
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

  const fetchAlmirahs = async () => {
    try {
      const { data } = await getAllAlmirahs(query, currentPage);
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
      fetchAlmirahs();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    fetchAlmirahs();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Quản lý tủ sách</h2>
        <div>
          <button
            className="btn btn__secondary"
            onClick={() => {
              setShowAddNewModel(true);
            }}
          >
            THÊM MỚI
          </button>
          
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Tìm kiếm tủ sách ...."
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
              <td>Chủ đề</td>
              <td>Số thứ tự của tủ sách</td>
              <td>Tùy chỉnh</td>
            </tr>
          </thead>
          <tbody>
            {data?.almirahs?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i._id}</td>
                  <td>{i.subject}</td>
                  <td>{i.number}</td>
                  <td>
                    <button
                      className="btn btn__warning"
                      onClick={() => {
                        setFormData({
                          subject: i.subject,
                          number: i.number,
                          _id: i._id,
                        });
                        setShowUpdateModel(true);
                      }}
                    >
                      <FaEdit />
                    </button>
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
        title="Thêm tủ sách mới"
        show={showAddNewModel}
        onClose={handleCloseAddNewModel}
      >
        <form onSubmit={handleAddNew}>
          <div className="form-control">
            <label htmlFor="subject">Chủ đề của tủ sách</label>
            <input
              type="text"
              placeholder="Nhập chủ đề của tủ sách"
              name="subject"
              className="bg text__color"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="number">Số thứ tự tủ sách</label>
            <input
              type="text"
              placeholder="Nhập số thứ tự tủ sách"
              name="number"
              className="bg text__color"
              value={formData.number}
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
        title="CẬP NHẬT TỦ SÁCH"
        show={showUpdateModel}
        onClose={handleCloseUpdateModel}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-control">
            <label htmlFor="subject">Chủ đề của tủ sách</label>
            <input
              type="text"
              placeholder="Nhập chủ đề của tủ sách"
              name="subject"
              className="bg text__color"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="number">Số thứ tự của tủ sách</label>
            <input
              type="text"
              placeholder="Nhập số thứ tự của tủ sách"
              name="number"
              className="bg text__color"
              value={formData.number}
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

export default ManageAlmirah;
