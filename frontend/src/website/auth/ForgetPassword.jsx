import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgetPassword } from '../../http';
import {toast} from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const promise = forgetPassword({email});
    toast.promise(
      promise,
      {
        loading : 'Loading',
        success : (data) => {
          navigate("/email-sent");
          return "Email Sent"
        },
        error : (err) => err?.response?.data?.message
      }
    );
  }
  return (
    <div className="bg text__color auth__card__wrapper">
      <div className="auth__card__container">
        <div className="heading">
          <h1>QUÊN MẬT KHẨU</h1>
        </div>
        <p>Nhập email của bạn </p>
        <form onSubmit={handleSubmit}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" />
            </div>
            <button className="btn btn__primary">SUBMIT</button>
            <Link to="/login" className="text__color">Quay lại đăng nhập ? </Link>
        </form>
        
      </div>
    </div>
  )
}

export default ForgetPassword