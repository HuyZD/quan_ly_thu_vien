import "./profile.scss";
import profileImage from "../../../assets/avatar.svg";
import { useState } from "react";
import { Modal } from "../../../components";
import { BASE_URL, updateProfileImage } from "../../../http";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [image, setImage] = useState(
    user?.imagePath ? `${BASE_URL}/${user?.imagePath}` : profileImage
  );
  const [show, setShow] = useState(false);
  /* IF IMAGE CHANGE THEN UPDATE */
  const [isUpdate, setIsUpdate] = useState(false);
  const dispatch = useDispatch();

  const handleCloseModel = () => {
    setShow(false);
    setImage(user?.imagePath ? `${BASE_URL}/${user?.imagePath}` : profileImage);
  };

  const captureImage = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setIsUpdate(true);
    /* BROWSER API */
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      // console.log(reader.result);
      setImage(reader.result);
    };
  };

  const handleUpdate = async (e) => {
    if (!isUpdate) {
      toast.error("Chọn ảnh trước khi cập nhật !");
      return;
    }
    const promise = updateProfileImage({ avatar: image });
    toast.promise(promise, {
      loading: "Đang cập nhật...",
      success: (res) => {
        dispatch(setAuth(res?.data));
        setShow(false);
        return "Cập nhật ảnh thành công!";
      },
      error: (err) => {
        console.log(err);
        return "Lỗi";
      },
    });
  };
  return (
    <div className="profile__wrapper bg">
      <div className="profile__container bg__accent">
        <div className="avatar">
          <img src={image} alt="not found" />
        </div>
        <p
          className="text__primary"
          onClick={() => {
            setShow(true);
          }}
        >
         Thay đổi ảnh đại diện?
        </p>
        <div className="table__wrapper">
          <table>
            <tr>
              <th>Tên</th>
              <td>{user?.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user?.email}</td>
            </tr>

            <tr>
              <th>Vai trò</th>
              <td>{user?.role=== "Student" ? "Sinh viên" : "Giảng viên"}</td>
            </tr>

            <tr>
              <th>Trạng thái tài khoản</th>
              <td>{user?.accountStatus=== "Active" ? "Hoạt động" : "Không hoạt động"}</td>
            </tr>

            {user?.role === "Student" && (
              <>
                <tr>
                  <th>Số điện thoại</th>
                  <td>{user?.rollNumber}</td>
                </tr>
              </>
            )}
          </table>
        </div>
      </div>

      <Modal title="Cập nhật ảnh" show={show} onClose={handleCloseModel}>
        <div className="avatar">
          <img src={image} alt="not found" />
        </div>
        <form action="">
          <input type="file" id="image" onChange={captureImage} required />
          <label htmlFor="image" className="text__primary">
            Chọn ảnh khác
          </label>
        </form>

        <div className="actions">
          <button className="btn btn__danger" onClick={handleCloseModel}>
            HỦY
          </button>
          <button className="btn btn__success" onClick={handleUpdate}>
            CẬP NHẬT
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
