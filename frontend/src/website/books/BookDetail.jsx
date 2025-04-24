import React, { useEffect, useState } from "react";
import image from "../../assets/cover404.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BASE_URL,
  STATUSES,
  createReview,
  getBook,
  reservedBook,
} from "../../http";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import Stars from "../../components/website/stars/Stars";

const BookDetail = () => {
  const [book, setBook] = useState();
  const [status, setStatus] = useState(STATUSES.IDLE);
  const { _id } = useParams();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const submitReview = (e) => {
    e.preventDefault();
    const promise = createReview(_id, {
      rating: e.target.rating.value,
      comment: e.target.comment.value,
    });
    toast.promise(promise, {
      loading: "Đang thêm...",
      success: (response) => {
        e.target.rating.value = "";
        e.target.comment.value = "";
        console.log(response);
        setBook(response?.data?.book);
        return "Thêm bình luận thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  const handleReservedBook = () => {
    const promise = reservedBook({
      ISBN: book?.ISBN,
    });
    toast.promise(promise, {
      loading: "Đang đặt...",
      success: (response) => {
        setBook(response?.data?.book);
        return "Đặt thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "lỗi !";
      },
    });
  };

  const fetchBook = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getBook(_id);
      setBook(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.log(error);
      setStatus(STATUSES.ERROR);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  if (status === STATUSES.LOADING) {
    return <div className="">Đang tải....</div>;
  }

  if (status === STATUSES.ERROR) {
    return <div className="alert alert__danger">Lỗi</div>;
  }

  return (
    <div className="book__detail bg text__color">
      <button
        className="btn btn__secondary"
        style={{ marginBottom: "10px" }}
        onClick={() => {
          navigate(-1);
        }}
      >
        Quay lại
      </button>

      <div className="book__container">
        <div className="image">
          <img
            src={book?.imagePath ? `${BASE_URL}/${book?.imagePath}` : image}
            alt="book image"
          />
        </div>
        <div className="content">
          <h2>{book?.title}</h2>
          <p>ID : {book?.ISBN}</p>
          <p>Sáng tác bởi {book?.author}</p>
          <p>
            <Stars rating={book?.rating} />
          </p>
          <p>
            {book?.totalReviews} Bình luận | {book?.rating} /5
          </p>
          <p style={{ display: "flex", columnGap: "5px" }}>
            <span>Trạng thái : </span>{" "}
            <span
              className={`badge ${book?.status === "Available"
                  ? "badge__success"
                  : book?.status === "Issued"
                    ? "badge__danger"
                    : book?.status === "Reserved"
                      ? "badge__warning"
                      : "badge__info"
                }`}
            >
              {book?.status === "Available"
                ? "Có sẵn"
                : book?.status === "Issued"
                  ? "Đã mượn"
                  : "Đã đặt"}
            </span>
          </p>
          <p>
            <span>Chủ đề : </span>
            {book?.category?.name}
          </p>
          <p>
            <span>Tủ sách :</span> {book?.almirah?.number} (
            {book?.almirah?.subject})
          </p>
          <p>
            <span>Phiên bản : </span>
            {book?.edition}
          </p>
          <p>
            <span>Nhà sản xuất : </span>
            {book?.publisher}
          </p>
          <p>
            <span>Mô tả :</span>
            {book?.description}
          </p>

          {/* CHECK USER IS LOGIN AND BOOK STATUS IS AVAILABE THEN ALLOW TO RESERVED BOOK */}

          <div className="action">
            {book?.status === "Available" ? (
              auth?.isAuth ? (
                <div>
                  <button
                    className="btn btn__secondary"
                    onClick={handleReservedBook}
                  >
                    ĐẶT SÁCH
                  </button>
                </div>
              ) : (
                <div>
                  <h3>
                    Đăng nhập để đặt sách{" "}
                    <Link className="btn btn__primary" to="/login">
                      Đăng nhập
                    </Link>
                  </h3>
                </div>
              )
            ) : (
              <p className="badge badge__danger" style={{ width: "210px" }}>
                Sách hiện tại {book?.status === "Available"
                  ? "có sẵn"
                  : book?.status === "Issued"
                    ? "đã mượn"
                    : "đã đặt"}.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="reviews__container">
        <h1>ĐÁNH GIÁ</h1>

        <h4>Viết bình luận</h4>
        {!auth?.isAuth && (
          <span>
            Đăng nhập để viết bình luận cho sách{" "}
            <Link to="/login" className="text__primary">
              Đăng nhập
            </Link>{" "}
          </span>
        )}
        <form onSubmit={submitReview}>
          <div className="form-control ">
            <label htmlFor="rating">Xếp hạng</label>
            <select
              name="rating"
              id="rating"
              className="bg__accent text__color"
              required
              disabled={!auth?.isAuth}
            >
              <option value="">Chọn</option>
              <option value={1}>1-Tệ</option>
              <option value={2}>2-Bình thường</option>
              <option value={3}>3-Tốt</option>
              <option value={4}>4-Rất tốt</option>
              <option value={5}>5-Tuyệt vời</option>
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="comment">Bình luận</label>
            <textarea
              name="comment"
              id="comment"
              cols="30"
              rows="4"
              className="bg__accent text__color"
              required
              disabled={!auth?.isAuth}
            ></textarea>
          </div>
          <div style={{ margin: "20px 0" }}>
            <button
              type="submit"
              className="btn btn__secondary"
              disabled={!auth?.isAuth}
            >
              OK
            </button>
          </div>
        </form>

        {book?.reviews?.map((review) => {
          return (
            <div className="review" key={review._id}>
              <p className="text__primary">
                {review?.user?.name ? review?.user?.name : auth?.user?.name}
              </p>
              <p className="date">{formatDate(review.createdAt)}</p>
              <p>
                <Stars rating={review?.rating} />
              </p>
              <p>{review?.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookDetail;
