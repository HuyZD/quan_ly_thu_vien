import React from "react";
import { MdCancel, MdDashboard, MdPendingActions } from "react-icons/md";
import {
  FaBook,
  FaList,
  FaLock,
  FaUserAlt,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { BiCategoryAlt } from "react-icons/bi";
import { SiBookstack } from "react-icons/si";
import { useState } from "react";
import { AppBar, SideBar } from "../../../components";
import { Outlet } from "react-router-dom";
import { AiFillBell, AiFillMessage } from "react-icons/ai";

const menu = [
  {
    id: 1,
    title: "Trang chủ",
    listItems: [
      {
        id: 1,
        text: "Bảng điều khiển",
        link: "/admin/dashboard",
        icon: <MdDashboard />,
      },
    ],
  },
  {
    id: 5,
    title: "Giao dịch",
    listItems: [
      {
        id: 1,
        text: "Sách đã mượn",
        link: "manage-issued-books",
        icon: <SiBookstack />,
      },
      {
        id: 2,
        text: "Sách đã đặt",
        link: "reserved-books-list",
        icon: <SiBookstack />,
      },
      {
        id: 3,
        text: "Sách đã trả",
        link: "returned-books-list",
        icon: <SiBookstack />,
      },
      {
        id: 4,
        text: "Gia hạn sách",
        link: "manage-renew-requests",
        icon: <FaBookOpen />,
      },
    ],
  },
  {
    id: 2,
    title: "Người dùng",
    listItems: [
      {
        id: 1,
        text: "Sinh viên",
        link: "manage-students",
        icon: <FaUsers />,
      },
      {
        id: 2,
        text: "Giảng viên",
        link: "manage-teachers",
        icon: <FaUsers />,
      },
    ],
  },
  {
    id: 3,
    title: "Sách",
    listItems: [
      {
        id: 1,
        text: "Sách",
        link: "manage-books",
        icon: <FaBook />,
      },
      {
        id: 2,
        text: "Thể loại sách",
        link: "manage-categories",
        icon: <BiCategoryAlt />,
      },
      {
        id: 3,
        text: "Tủ sách",
        link: "manage-almirahs",
        icon: <FaList />,
      },
    ],
  },
  {
    id: 7,
    title: "Tài khoản",
    listItems: [
      {
        id: 1,
        text: "Thông tin cá nhân",
        link: "profile",
        icon: <FaUserAlt />,
      },

      {
        id: 3,
        text: "Thay đổi mật khẩu",
        link: "change-password",
        icon: <FaLock />,
      },
    ],
  },
];

const AdminDashboardLayout = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="dashboard__layout">
      <SideBar menu={menu} open={open} setOpen={setOpen} />
      <div className="container bg">
        <AppBar open={open} setOpen={setOpen} />
        <main className="bg text__color">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
