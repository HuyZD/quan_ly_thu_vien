import UserDashboardLayout from "./user/userDashboardLayout/UserDashboardLayout";
import UserHome from "./user/userHome/UserHome";
import BorrowedBooks from "./user/BorrowedBooks";
import ReturnedBooks from "./user/ReturnedBooks";
import ReservedBooks from "./user/ReservedBooks";
import ChangePassword from "./common/changepassword/ChangePassword";

/* ADMIN  */
import AdminDashboardLayout from "./admin/adminDashboardLayout/AdminDashboardLayout";
import AdminHome from "./admin/adminHome/AdminHome";
import ManageCategory from "./admin/manageEntities/ManageCategory";
import ManageAlmirah from "./admin/manageEntities/ManageAlmirah";
import ManageTeacher from "./admin/manageEntities/ManageTeacher";
import ManageStudent from "./admin/manageEntities/ManageStudent";
import UserDetail from "./admin/UserDetail/UserDetail";
import ManageBook from "./admin/manageEntities/ManageBook";
import AddNewBook from "./admin/manageEntities/AddNewBook";
import UpdateBook from "./admin/manageEntities/UpdateBook";
import ManageIssueBooks from "./admin/transactions/ManageIssuedBooks";
import IssueBook from "./admin/transactions/IssueBook";
import ReservedBookList from "./admin/transactions/ReservedBookList";
import ReturnedBookList from "./admin/transactions/ReturnedBookList";
import ManageRenewRequests from "./admin/transactions/ManageRenewRequests";

export {
    UserDashboardLayout,
    UserHome,
    AdminDashboardLayout,
    AdminHome,
    BorrowedBooks,
    ReservedBooks,
    ReturnedBooks,
    ChangePassword,
    ManageCategory,
    ManageAlmirah,
    ManageTeacher,
    ManageStudent,
    UserDetail,
    ManageBook,
    AddNewBook,
    UpdateBook,

    ManageIssueBooks,
    IssueBook,
    ReservedBookList,
    ReturnedBookList,
    ManageRenewRequests,
}