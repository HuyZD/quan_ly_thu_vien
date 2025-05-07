import profileImage from "../../../assets/avatar.svg";
import { useState } from "react";
import { BASE_URL, getUserDetails } from "../../../http";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const UserDetail = () => {
  const [user, setUser] = useState({});
  const {_id} = useParams();
  const fetchUserDetails = async ()=>{
    try {
        const {data} = await getUserDetails(_id);
        setUser(data?.user)
        setImage( data?.user?.imagePath ? `${BASE_URL}/${data?.user?.imagePath}` : profileImage)
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, [])
  
  const [image, setImage] = useState(
    user?.imagePath ? `${BASE_URL}/${user?.imagePath}` : profileImage
  );

  return (
    <div className="profile__wrapper bg">
      <div className="profile__container bg__accent">
        <div className="avatar">
          <img src={image} alt="not found" />
        </div>

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
              <th>Trạng thái </th>
              <td>{user?.accountStatus=== "Active" ? "Hoạt động" : "Không hoạt động"}</td>
            </tr>

            {user?.role === "Student" && (
              <>
                <tr>
                  <th>MSV</th>
                  <td>{user?.rollNumber}</td>
                </tr>

              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
