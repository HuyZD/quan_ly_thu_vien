import "./adminhome.scss";
import { BarChart, CountCard, Loader, PieChart } from "../../../components";
import { useEffect, useState } from "react";
import { STATUSES, getAdminDashboardStats } from "../../../http";
import { formatDate } from "../../../utils/formatDate";

const AdminHome = () => {
  const [status, setStatus] = useState(STATUSES.IDLE);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getAdminDashboardStats();
      setData(data);
      console.log(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.log(error);
      setStatus(STATUSES.ERROR);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (status === STATUSES.LOADING) {
    return <Loader />;
  }

  return (
    <div className="user__home__container">
      {/* COUNTER CARDS */}
      <div className="card__wrapper">
        <CountCard
          heading={"Tổng số sách"}
          count={data?.numberOfTotalBooks}
          link={"manage-books"}
        />
        <CountCard
          heading={"Sách đã mượn"}
          count={data?.numberOfBorrowedBooks}
          link={"manage-issued-books"}
        />
        <CountCard
          heading={"Sách đã đặt"}
          count={data?.numberOfReservedBooks}
          link={"reserved-books-list"}
        />
       
      </div>
    </div>
  );
};

export default AdminHome;
