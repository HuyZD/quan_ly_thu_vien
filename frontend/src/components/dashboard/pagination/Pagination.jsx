import React from "react";

const Pagination = ({ currentPage, setCurrentPage, data }) => {
  const startIndex = (currentPage - 1) * data?.limit + 1;
  const endIndex = Math.min(currentPage * data?.limit, data?.totalRecords);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  return (
    <div className="pagination">
      <span>
        {/* Hiển thị {startIndex}-{endIndex} / {data?.totalRecords} trang */}
      </span>
      <div className="pagination">
        <button
          className="btn btn__secondary"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Trang trước
        </button>
        <span>{currentPage}</span>
        <button
          className="btn btn__secondary"
          disabled={currentPage === data?.totalPages || data?.totalPages === 0}
          onClick={handleNextPage}
        >
         Trang sau 
        </button>
      </div>
    </div>
  );
};

export default Pagination;
