import React, { useEffect, useState } from "react";
import {
  ReturnBook,
  exportBooks,
  getAllIssuedBooks,
  payFine,
} from "../../../http";

import { toast } from "react-hot-toast";
import { Modal, Pagination } from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

const ManageIssueBooks = () => {
  const [query, setQuery] = useState({ ISBN: "", rollNumber: "", email: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const navigate = useNavigate();
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleExport = () => {
    const promise = exportBooks();
    toast.promise(promise, {
      loading: "Exporting...",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Books Exported successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllIssuedBooks(query, currentPage);
      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* FETCH DATA WHEN QUERIES CHANGE */

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

  /* FETCH DATA WHEN CURRENT PAGE CHANGE */
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const onPayFine = (e) => {
    e.preventDefault();
    const promise = payFine({
      transactionID: selectedTransaction._id,
    });
    toast.promise(promise, {
      loading: "Đang thanh toán...",
      success: (data) => {
        setSelectedTransaction(false);
        fetchData();
        setShowFineModal(false);
        return "Thanh toán thành công..";
      },
      error: (err) => {
        console.log();
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const onBookReturn = (selectedRow) => {
    
    /* CHECK FINE PAID OR NOT */
    console.log(selectedRow?.isPaid);
    console.log(selectedRow?.fine);
    console.log(selectedRow);
    if ((selectedRow?.fine == 0) || selectedRow?.isPaid) {
      const promise = ReturnBook({
        transactionID: selectedRow._id,
      });
      toast.promise(promise, {
        loading: "Đang trả...",
        success: (data) => {
          fetchData();
          return "Trả sách thành công..";
        },
        error: (err) => {
          console.log(err);
          return err?.response?.data?.message || "Lỗi !";
        },
      });
    } else {
      toast.error("Vui lòng trả phí phạt");
    }
  };

  const closeFineModal = () => {
    setShowFineModal(false);
    setSelectedTransaction({});
  };

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Mượn sách</h2>
        <div>
          <Link
            to="/admin/dashboard/issue-book"
            className="btn btn__secondary"
          >
            Mượn sách
          </Link>
       
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Tìm kiếm theo id...."
          className="background__accent text"
          value={query.ISBN}
          onChange={(e) => {
            setQuery({ ...query, ISBN: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo msv...."
          className="background__accent text"
          value={query.rollNumber}
          onChange={(e) => {
            setQuery({ ...query, rollNumber: e.target.value });
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
            setQuery({ email: "", ISBN: "", rollNumber: "" });
          }}
        >
          XÓA
        </button>
      </div>

      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ID</td>
              {/* <td>Title</td> */}
              {/* <td>User Name</td> */}
              <td>MSV/Email</td>
              <td>Ngày mượn</td>
              <td>Ngày hết hạn</td>
              <td>Phí phạt</td>
              <td>Trạng thái phạt</td>
              <td>Tùy chỉnh</td>
            </tr>
          </thead>
          <tbody>
            {data?.transactionsWithFine?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i.ISBN}</td>
                  {/* <td>{i.book?.title}</td> */}
                  {/* <td>{i.user?.name}</td> */}
                  <td>
                    {i.rollNumber ? (
                      <span>{i.rollNumber}</span>
                    ) : (
                      <span>{i.user?.email}</span>
                    )}
                  </td>

                  <td>{formatDate(i.borrowDate)}</td>
                  <td>{formatDate(i.dueDate)}</td>
                  <td>
                    <span
                      className={`badge badge__sm ${
                        i.fine > 0 ? "badge__danger" : "badge__success"
                      }`}
                    >
                      {i.fine}
                    </span>
                  </td>
                  <td>
                    {i.fine <= 0 ? (
                      <span>-</span>
                    ) : i.isPaid ? (
                      <span>Đã thanh toán</span>
                    ) : (
                      <span>Chưa thanh toán</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn__secondary"
                      disabled={i.fine <= 0 || i.isPaid}
                      onClick={() => {
                        setShowFineModal(true);
                        setSelectedTransaction(i);
                      }}
                    >
                      Thanh toán phạt
                    </button>
                    <button
                      className="btn btn__primary"
                      onClick={() => {
                        onBookReturn(i);
                      }}
                    >
                      Đã trả
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

      {/* FINE MODAL */}
      <Modal title="Pay Fine" show={showFineModal} onClose={closeFineModal}>
        <form onSubmit={onPayFine}>
          <div className="form-control">
            <label htmlFor="transaction__id">Mã giao dịch</label>
            <input
              type="text"
              className="bg"
              value={selectedTransaction?._id}
              disabled
            />
          </div>
          <div className="form-control">
            <label htmlFor="transaction__id">ID Sách</label>
            <input
              type="text"
              className="bg"
              value={selectedTransaction?.ISBN}
              disabled
            />
          </div>
          <div className="form-control">
            <label htmlFor="transaction__id">Số tiền phải trả</label>
            <input
              type="text"
              className="bg"
              value={selectedTransaction?.fine}
              disabled
            />
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={closeFineModal}
            >
              HỦY
            </button>
            <button type="submit" className="btn btn__success">
              OK
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageIssueBooks;
