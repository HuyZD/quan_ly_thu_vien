import React, { useEffect, useState } from "react";
import { getBorrowedBooks, renewBookRequest } from "../../http";
import { formatDate } from "../../utils/formatDate";
import Modal from "../../components/dashboard/modal/Modal";
import toast from "react-hot-toast";

const columns = [
  "ID",
  "Tiêu đề",
  "Tác giả",
  "Ngày mượn",
  "Ngày hết hạn",
  "Số ngày còn lại",
  "Trạng thái gia hạn",
];

function calculateDaysLeft(dueDateISO) {
  const dueDate = new Date(dueDateISO);
  const currentDate = new Date();

  const timeDifference = dueDate - currentDate;

  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference > 0) {
    return `${daysDifference} ngày`;
  } else if (daysDifference === 0) {
    return "Due today";
  } else {
    return `${Math.abs(daysDifference)} ngày`;
  }
}

const BorrowedBooks = () => {
  const [books, setBooks] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchBorrowedBooks = async () => {
    try {
      const { data } = await getBorrowedBooks();
      // console.log(data?.borrowedBooks);
      setBooks(data?.borrowedBooks);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRenewRequest = (e) => {
    e.preventDefault();
    const promise = renewBookRequest({
      transactionID: selectedTransaction,
      renewalDays: e.target.renewalDays.value,
    });
    toast.promise(promise, {
      loading: "Đang tải...",
      success: (response) => {
        const updatedBookData = response.data.transaction;
        console.log(updatedBookData);
        // Update the book in state
        setBooks((prevBooks) => {
          const bookIndex = prevBooks.findIndex(
            (book) => book._id === updatedBookData._id
          );
          prevBooks[bookIndex] = updatedBookData;
          return [...prevBooks];
        });
        console.log(books);
        e.target.renewalDays.value = "";
        setShowModal(false);
        return "Gửi thành công.";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);
  return (
    <div className="datalist__wrapper">
      <h2>Sách đã mượn</h2>
      <span>Danh sách sách đã mượn</span>

      <div className="table__wrapper bg__accent">
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr className="bg__secondary">
              <td>STT</td>
              {columns?.map((column) => {
                return <td key={column}>{column}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {books?.map((item, index) => {
              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item?.book?.ISBN}</td>
                  <td>{item?.book?.title}</td>
                  <td>{item?.book?.author}</td>
                  <td>{formatDate(item?.borrowDate)}</td>
                  <td>{formatDate(item?.dueDate)}</td>
                  <td>{calculateDaysLeft(item?.dueDate)}</td>
                  <td>
                    {item?.renewStatus === "None" ? (
                      <button
                        className="btn btn__secondary"
                        onClick={() => {
                          setShowModal(true);
                          setSelectedTransaction(item._id);
                        }}
                      >
                        GIA HẠN
                      </button>
                    ) : (
                      <span
                        className={`badge ${
                          item?.renewStatus === "Pending"
                            ? "badge__warning"
                            : item?.renewStatus === "Rejected"
                            ? "badge__danger"
                            : "badge__success"
                        }`}
                      >
                        {item?.renewStatus === "Pending" ? "Đang xử lý" : item?.renewStatus === "Rejected" ? "Từ chối" : "Chấp nhận"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL FOR RENEW */}
      <Modal
        show={showModal}
        title={"Renew Book"}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <form onSubmit={handleRenewRequest}>
          <div className="form-control">
            <label htmlFor="renewalDays">Chọn ngày</label>
            <select
              name="renewalDays"
              id="renewalDays"
              required
              className="bg text__color"
            >
              <option value="">Số ngày bạn muốn gia hạn thêm</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
            </select>
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={() => {
                setShowModal(false);
              }}
            >
              HỦY
            </button>
            <button type="submit" className="btn btn__success">
              GỬI
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BorrowedBooks;
