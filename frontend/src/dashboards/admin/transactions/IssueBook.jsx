import { useState } from "react";
import "./issuebook.scss";
import { getBookInfo, getUserInfo, issueBook } from "../../../http";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../utils/formatDate";
const IssueBook = () => {
  const [userData, setUserData] = useState(null);
  const [bookData, setBookData] = useState(null);

  const searchStudent = (e) => {
    e.preventDefault();
    const promise = getUserInfo({
      email: e.target.email.value,
      rollNumber  : e.target.rollNumber.value,
    });
    toast.promise(promise, {
      loading: "Đang tải...",
      success: (data) => {
        setUserData(data?.data);
        /* CLEAR INPUT VALUE */
        e.target.email.value = "";
        e.target.rollNumber.value = "";
        return "Tìm kiếm sinh viên thành công..";
      },
      error: (err) => {
        console.log();
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const searchBook = (e) => {
    e.preventDefault();
    const promise = getBookInfo({
      ISBN: e.target.ISBN.value,
    });
    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        setBookData(data?.data);
        e.target.ISBN.value = "";
        return "Tìm kiếm sách thành công..";
      },
      error: (err) => {
        console.log();
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleIssueBook = () => {
    /* CHECK USER AND BOOK FOUND OR NOT ?  */
    if (!userData || !bookData) {
      toast.error("Chọn cả sách và người dùng !");
      return;
    }
    /* CHECK IF USER ALREADY BORROWED BOOKS AND EXCEED LIMIT */
    if (userData?.hasExceededLimit) {
      toast.error(`Vượt quá giới hạn !`);
      return;
    }
    /* CHECK IF BOOK STATUS IS ISSUED ? */
    if (bookData?.book?.status === "Issued") {
      toast.error(`Sách đã được mượn bởi người khác!`);
      return;
    }

    /* CHECK SAME USER RESERVED ? */
    if (bookData?.book?.status === "Reserved") {
      if (userData?.user?.email !== bookData?.reservedAlready?.user?.email) {
        toast.error("Sách đã được đặt bởi người khác !");
        return;
      }
    }

    /* ISSUE BOOK BECAUSE ALL CONDITION VALID */
    const promise = issueBook({
      bookID: bookData?.book?._id,
      userID: userData?.user?._id,
    });
    toast.promise(promise, {
      loading: "Đang mượn...",
      success: (data) => {
        setBookData(null);
        setUserData(null);
        return "Sách đã mượn thành công..";
      },
      error: (err) => {
        console.log();
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };
  return (
    <div className="issue__book">
      <h2>Mượn sách</h2>
      <div className="details__container">
        <div className="student__details">
          {/* SEARCH SECTION */}
          <h3>Tìm kiếm sinh viên</h3>
          <p>Tìm sinh viên muốn mượn sách.</p>
          <form onSubmit={searchStudent}>
            <div className="form-control">
              <input type="text" placeholder="Tìm kiếm theo email" name="email" />
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Tìm kiếm theo MSV"
                name="rollNumber"
              />
            </div>
            <button className="btn btn__secondary" type="submit">
              TÌM KIẾM
            </button>
          </form>

          {/* TABLE SECTION */}
          <div className="table__wrapper">
            <table>
              <tr>
                <th>Tên</th>
                <td>{userData?.user?.name}</td>
              </tr>
              <tr>
                <th>MSV</th>
                <td>{userData?.user?.rollNumber}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{userData?.user?.email}</td>
              </tr>

              <tr>
                <th>Vai trò</th>
                <td>{userData?.user?.role === "Student" ? "Sinh viên" : "Giảng viên"}</td>
              </tr>

              <tr>
                <th>Trạng thái</th>
                <td>{userData?.user?.accountStatus === "Active" ? "Hoạt động" : "Không hoạt động"}</td>
              </tr>

              <tr>
                <th>Sách đã mượn</th>
                <td>{userData?.numberOfBorrowedBooks}</td>
              </tr>

              <tr>
                <th>Số sách tối đa được mượn</th>
                <td>{userData?.maxBooksAllowed}</td>
              </tr>

              <tr>
                <th>Vượt giới hạn</th>
                <td>
                  {userData?.hasExceededLimit ? (
                    <span className="badge badge__danger">Yes</span>
                  ) : (
                    <span className="badge badge__success">No</span>
                  )}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="book__details">
          <h3>Tìm kiếm sách </h3>
          <p>Tìm sách muốn mượn</p>
          <form onSubmit={searchBook}>
            <div className="form-control">
              <input
                type="text"
                placeholder="Tìm kiếm theo id"
                required
                name="ISBN"
              />
            </div>
            <button className="btn btn__secondary" type="submit">
              TÌM KIẾM
            </button>
          </form>

          {/* TABLE SECTION */}
          <div className="table__wrapper">
            <table>
              <tr>
                <th>ID</th>
                <td>{bookData?.book?.ISBN}</td>
              </tr>

              <tr>
                <th>Tiêu đề</th>
                <td>{bookData?.book?.title}</td>
              </tr>
              <tr>
                <th>Tác giả</th>
                <td>{bookData?.book?.author}</td>
              </tr>

              <tr>
                <th>Trạng thái</th>
                <td>
                  <span
                    className={`badge ${
                      bookData?.book?.status === "Available"
                        ? "badge__success"
                        : bookData?.book?.status === "Issued"
                        ? "badge__danger"
                        : bookData?.book?.status === "Reserved"
                        ? "badge__warning"
                        : "badge__info"
                    }`}
                  >
                    { bookData?.book?.status === "Available"
                        ? "Có sẵn"
                        : bookData?.book?.status === "Issued"
                        ? "Đã mượn"
                        : "Đã đặt"
                       }
                  </span>
                </td>
              </tr>

              {bookData?.reservedAlready && (
                <>
                  <tr>
                    <th>Được đặt bởi</th>
                    <td>{bookData?.reservedAlready?.user?.email}</td>
                  </tr>

                  <tr>
                    <th>Ngày đặt</th>
                    <td>{formatDate(bookData?.reservedAlready?.date)}</td>
                  </tr>
                </>
              )}
            </table>
          </div>

          {/* ISSUE BUTTON */}
          <button className="btn btn__primary" onClick={handleIssueBook}>
            MƯỢN SÁCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;
