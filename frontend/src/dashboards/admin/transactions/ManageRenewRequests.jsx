import React, { useEffect, useState } from "react";
import { getRenewRequests, handleRenewRequest } from "../../../http";
import { formatDate } from "../../../utils/formatDate";
import toast from "react-hot-toast";

const ManageRenewRequests = () => {
  const [renewRequests, setRenewRequests] = useState(null);

  const fetchRequests = async () => {
    try {
      const { data } = await getRenewRequests();
      setRenewRequests(data?.renewRequests);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequest = async (id, status) => {
    const promise = handleRenewRequest({
      transactionID: id,
      renewalStatus: status,
    });
    toast.promise(promise, {
      loading: "Loading...",
      success: (response) => {
        /* REMOVE THIS FROM STATE */
        setRenewRequests((prevState)=>{
            const updatedState = prevState.filter((item) => item._id!== id );
            console.log(updatedState);
            return updatedState;
        })
        return "Request processed successfully!";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="datalist__wrapper">
      <h2>Quản lý yêu cầu gia hạn sách</h2>
      <span>Danh sách các yêu cầu gia hạn</span>

      <div className="table__wrapper bg__accent">
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr className="bg__secondary">
              <td>Thứ tự</td>
              <td>Tên người dùng</td>
              {/* <td>Email</td> */}
              <td>Tiêu đề sách</td>
              <td>Ngày mượn</td>
              <td>Ngày hết hạn</td>
              <td>Ngày gia hạn</td>
              <td>Tùy chỉnh</td>
            </tr>
          </thead>
          <tbody>
            {renewRequests?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.user?.name}</td>
                  {/* <td>{item?.user?.email}</td> */}
                  <td>{item?.book?.title}</td>
                  <td>{formatDate(item?.borrowDate)}</td>
                  <td>{formatDate(item?.dueDate)}</td>
                  <td>{item?.renewalDays}</td>
                  <td >
                    <div style={{width:'200px'}}>
                    <button
                      className="btn btn__success"
                      style={{ marginRight: "7px" }}
                      onClick={() => {
                        handleRequest(item._id,"Accepted"); 
                      }}
                    >
                chấp nhận
                    </button>
                    <button className="btn btn__danger" onClick={() => {
                        handleRequest(item._id,"Rejected");
                      }}>Từ chối</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRenewRequests;
