import React from "react";
import { AiOutlineMail } from "react-icons/ai";

const EmailSent = () => {
  return (
    <div className="bg text__color auth__card__wrapper">
      <div className="auth__card__container">
        <div className="heading">
          <h1>XÁC NHẬN TÀI KHOẢN</h1>
          <div className="bg__primary email__icon__box">
            <AiOutlineMail/>
          </div>
          <h5 style={{textAlign:"center",margin:"10px 0"}}>Kiểm tra gmail của bạn </h5>
          <p>Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến email của bạn</p>
          <div style={{textAlign:"center",margin:"20px 0"}}>
            <a
              href="https://mail.google.com/mail/u/0/#inbox"
              className="btn btn__primary"
            >
              VÀO GMAIL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
