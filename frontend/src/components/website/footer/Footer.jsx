import { Link } from "react-router-dom";
import "./footer.scss";
import { GiBookAura } from "react-icons/gi";
import { AiOutlineHome, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg__accent text__color">
      <div className="top">
        <div className="box1">
          <div className="logo text__primary">
            <GiBookAura className="icon" />
            <h4>Thư viện uet</h4>
          </div>
          <p style={{ marginTop: "8px", lineHeight: "1.5rem" }}>
          Cổng thông tin tri thức, khám phá và học tập suốt đời dành cho tất cả sinh viên,
          giảng viên và nhân viên của UET: Một không gian chào đón và hòa nhập dành cho tất cả người học để cùng nhau học hỏi.
          </p>
        </div>
        <div className="box2">
          <h4>Liên kết hữu ích</h4>
          <Link to="/" className="text__color">
            Trang chủ
          </Link>
          <Link to="/about-us" className="text__color">
            Thông tin về chúng tôi
          </Link>
          {/* <Link to="/contact-us" className="text__color">
            Liên hệ chúng tôi
          </Link> */}
          <Link to="/login" className="text__color">
            Đăng nhập
          </Link>
        </div>

        <div className="box3">
          <h4>Các liên kết khác</h4>
          <Link to="/" className="text__color">
            Sách
          </Link>
          <Link to="/contact-us" className="text__color">
            Bảng điều khiển
          </Link>
          <Link to="/login" className="text__color">
            Quên mật khẩu
          </Link>
        </div>

        <div className="box4">
          <h4>Liên hệ</h4>
          <div className="item">
            <AiOutlineHome className="icon" />
            <span>Trường đại học Công Nghệ - VNU</span>
          </div>
          <div className="item">
            <AiOutlineMail className="icon" />
            <span>gvh@vnu.edu.vn</span>
          </div>
          <div className="item">
            <AiOutlinePhone className="icon" />
            <span>0999999999</span>
          </div>
        </div>
      </div>
      <div className="bottom">
      <span> &copy;2023 Bản quyền: Hệ thống Quản lý Thư viện UET, Huy Giang </span>
      </div>
    </footer>
  );
};

export default Footer;
