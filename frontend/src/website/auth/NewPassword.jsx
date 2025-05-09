import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from "react-hot-toast";
import { resetPassword } from '../../http';

const NewPassword = () => {
  const {token} = useParams();
  console.log(token);
  const navigate = useNavigate();

  function handleSubmit(e) {
      e.preventDefault();
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword.value;
      if(password !== confirmPassword) {
          toast.error("Mật khẩu không khớp !");
          return;
      }
      const promise = resetPassword({newPassword: password,token});

      toast.promise(promise,{
        loading : 'Loading..',
        success : (data) => {
            navigate("/login");
            return "Thay đổi mật khẩu thành công !"
        },
        error : (err) =>{
          navigate("/forget-password");
          return  err?.response?.data?.message;
        }
      })

      console.log(password,confirmPassword);
  }

  return (
    <div className="bg text__color auth__card__wrapper">
      <div className="auth__card__container">
        <div className="heading">
          <h1>MẬT KHẨU MỚI</h1>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="form-control password__input ">
                <label htmlFor="password">MẬT KHẨU</label>
                <input type= "password" name="password"  />
            </div>
            <div className="form-control">
                <label htmlFor="confirmPassword">XÁC NHẬN MẬT KHẨU</label>
                <input type="password" name="confirmPassword" />
            </div>
            <button type='submit' className="btn btn__primary">CÀI LẠI MẬT KHẨU</button>
        </form>
        
      </div>
    </div>
  )
}

export default NewPassword