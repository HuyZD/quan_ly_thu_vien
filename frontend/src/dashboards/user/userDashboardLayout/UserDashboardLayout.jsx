import { useState } from "react";
import { AppBar, SideBar } from "../../../components";
import {Outlet} from "react-router-dom";
import {MdOutlineDashboard,MdFeedback, MdCancel, MdPendingActions} from "react-icons/md";
import {FaBook,FaUserAlt,FaLock, FaWpforms} from "react-icons/fa";
import {ImBooks} from "react-icons/im";
import {AiFillBell} from "react-icons/ai";
import { useSelector } from "react-redux";
import { FcApproval } from "react-icons/fc";


const UserDashboardLayout = () => {
  const [open,setOpen] = useState(true);
  const auth = useSelector((state)=>state.auth);
  const menu = [
    {
      id: 1,
      title : "Trang chủ",
      listItems:[
        {
          id : 1,
          text : "Bảng điều khiển",
          link : "/user/dashboard",
          icon : <MdOutlineDashboard/>
        }
      ] 
    },
    {
      id: 2,
      title : "Sách",
      listItems:[
        {
          id : 1,
          text : "Sách đã mượn",
          link : "borrowed-books",
          icon : <ImBooks/>
        },
        {
          id : 2,
          text : "Sách đã đặt",
          link : "reserved-books",
          icon : <FaBook/>
        },
        {
          id : 3,
          text : "Sách đã trả",
          link : "returned-books",
          icon : <ImBooks/>
        },
        // {
        //   id : 4,
        //   text : "Recommended",
        //   link : "borrowed-books",
        //   icon : <FaBook/>
        // }
      ] 
    },
    // {
    //   ...((auth?.user?.role === "HOD" ||auth?.user?.role === "Clerk"  ) && {
    //     id: 6,
    //     title : "Clearance Requests",
    //     listItems:[
    //       {
    //         id : 1,
    //         text : "Pending",
    //         link : "manage-clearance-form/Pending",
    //         icon : <MdPendingActions/>
    //       },
    //       {
    //         id : 2,
    //         text : "Approved",
    //         link : "manage-clearance-form/Approved",
    //         icon : <FcApproval/>
    //       },
          
    //       {
    //         id : 3,
    //         text : "Rejected",
    //         link : "manage-clearance-form/Rejected",
    //         icon : <MdCancel/>
    //       },
          
    //     ] 
    //   })
    // },
  
    {
      id: 3,
      title : "Tài khoản",
      listItems:[
        {
          id : 1,
          text : "Thông tin cá nhân",
          link : "profile",
          icon : <FaUserAlt/>
        },
        // {
        //   id : 2,
        //   text : "Notifications",
        //   link : "borrowed-books",
        //   icon : <AiFillBell/>
        // },
        
        {
          id : 3,
          text : "Thay đổi mật khẩu",
          link : "change-password",
          icon : <FaLock/>
        },
        // {
        //   ...(auth?.user?.role==="Student" && {
        //     id : 4,
        //     text : "Clearance Request",
        //     link : "clearance-form",
        //     icon : <FaWpforms/>
        //   })
        // }
        
      ] 
    },
  ]
  
  return (
    <div className='dashboard__layout bg'>
        <SideBar menu={menu} open={open} setOpen={setOpen} />
        <div className="container bg">
            <AppBar open={open} setOpen={setOpen} />
            <main className='bg text__color'>
              <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default UserDashboardLayout