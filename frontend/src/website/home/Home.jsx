import "./home.scss";
import { Link } from "react-router-dom";

import principalImage from "../../assets/principal.jpg";
import bookImage from "../../assets/book1.jpg";
import { FaAtlas, FaBook, FaLayerGroup, FaUser } from "react-icons/fa";
import { CustomSlider, Loader, Stars } from "../../components";
import { useEffect, useState } from "react";
import { BASE_URL, STATUSES, getHomePageData } from "../../http";

const Home = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(STATUSES.IDLE);

  const fetchData = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getHomePageData();
      setData(data);
      // console.log(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      setStatus(STATUSES.ERROR);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (status === STATUSES.LOADING) {
    return <Loader />;
  }

  if (status === STATUSES.ERROR) {
    return <div className="text__color">Error while loading data........</div>;
  }

  return (
    <div className="bg text__color">
      {/* Hero Section */}
      <section className="hero ">
        <h1>Chào mừng bạn đến với thư viện UET</h1>
        <span className="subheading">
          Khám phá bộ sưu tập sách và tài nguyên phong phú của chúng tôi.
        </span>

        <Link to="/books" className="btn btn__secondary">
          Danh mục sách
        </Link>
      </section>
      {/* End of Hero Section */}

      {/* Welcome Message */}
      <section className="welcome">
        <div className="left">
          <div className="heading">
            <h1>Lời giới thiệu </h1>
          </div>
          <p> Chào mừng bạn đến với Hệ thống Quản lý Thư viện của Trường Đại học Công Nghệ - Đại học quốc gia Hà NộiNội</p>
          <p> Thư viện hiện đại và hoàn toàn tự động của chúng tôi chắc chắn là một Trung tâm Tài nguyên Thông
            tin tiên tiến, đáp ứng những nhu cầu ngày càng thay đổi của khách hàng học thuật của chúng tôi
            .Mục tiêu của Thư viện UET là cung cấp các tài nguyên thông tin kỹ thuật số và trực tuyến tốt nhất cùng các dịch vụ tham khảo
            để hỗ trợ các hoạt động giảng dạy, học tập và nghiên cứu của bạn. Chúng tôi cũng cung cấp một môi trường thuận lợi
            và không gian tuyệt vời cho nghiên cứu, học tập và hợp tác. </p>
        </div>

        <div className="right">
          <img src="https://cmc.vnu.edu.vn/Uploads/Adv/2024_1_8_8_25_44uet.jpg" alt="Principal Image" />
        </div>
      </section>
      {/* End of Welcome message */}

      {/* START OF POPULAR BOOKS SECTIONS */}
      <section className="popular__books">
        <div className="heading">
          <h1>Sách phổ biến</h1>
        </div>
        <div className="card__wrapper">
          {data?.popularBooks?.map((popularBook) => {
            return (
              <div className="card bg__accent" key={popularBook._id}>
                <img
                  src={
                    popularBook?.imagePath
                      ? `${BASE_URL}/${popularBook?.imagePath}`
                      : bookImage
                  }
                  alt="Book Image Not Found"
                />
                <div className="content">
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      marginBottom: "10px",
                    }}
                  >
                    {popularBook.title}
                  </p>
                  <p>By {popularBook.author}</p>
                  <p>
                    <Stars rating={popularBook.rating} />{" "}
                  </p>
                  <p>
                    {popularBook?.totalReviews} Đánh giá | {popularBook?.rating}{""}
                    /5
                  </p>
                  <div className="action">
                    <Link
                      className="btn btn__secondary"
                      to={`/books/${popularBook._id}/`}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="button">
          <Link to="/books" className="btn btn__primary">
            Xem tất cả
          </Link>
        </div>
      </section>
      {/* END OF POPULAR BOOKS SECTIONS */}

      {/* Counter Section */}
      <section className="counter__section">
        <div>
          <FaBook className="icon" />
          <h3>Số lượng sách</h3>
          <p>{data?.totalBooks}</p>
        </div>

        <div>
          <FaUser className="icon" />
          <h3>Số lượng người dùng</h3>
          <p>{data?.totalUsers}</p>
        </div>
        <div>
          <FaLayerGroup className="icon" />
          <h3>Số danh mục</h3>
          <p>{data?.totalCategories}</p>
        </div>
      </section>
      {/* End of Counter Section */}

      <CustomSlider data={data?.newBooks} />
    </div>
  );
};

export default Home;
