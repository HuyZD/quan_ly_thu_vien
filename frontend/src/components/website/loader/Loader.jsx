import React from 'react';
import {FaSpinner} from "react-icons/fa";
import "./loader.scss";

function Loader() {
  return (
    <div className="spinner text__color">
      <h1>Thư viện UET</h1>
      <FaSpinner className="loader-icon" />
      <p>Đang tải...</p>
    </div>
  )
}

export default Loader