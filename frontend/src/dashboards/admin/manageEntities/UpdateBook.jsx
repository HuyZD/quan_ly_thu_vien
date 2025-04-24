import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  addNewBook,
  getAllAlmirahsWithoutPagination,
  getAllCategoriesWithoutPagination,
  getBook,
  updateBook,
} from "../../../http";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBook = () => {
  const { _id } = useParams();
  const [categories, setCategories] = useState();
  const [almirahs, setAlmirahs] = useState();
  const navigate = useNavigate();
  const initailState = {
    ISBN: "",
    title: "",
    category: "",
    author: "",
    almirah: "",
    publisher: "",
    shelf: "",
    image: "",
    edition: "",
    description: "",
  };
  const [formData, setFormData] = useState(initailState);

  //   handle change into input fields
  const hanldeInputChange = (e) => {
    const { name, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToPost = new FormData();
    for (const key in formData) {
      if (formData[key] !== "") {
        dataToPost.append(key, formData[key]);
      }
    }

    const promise = updateBook(_id,dataToPost);

    toast.promise(promise, {
      loading: "Updating...",
      success: (data) => {
        return "Cập nhật sách thành công..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Lỗi !";
      },
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: bookData } = await getBook(_id);
        setFormData({
            ISBN : bookData.ISBN,
            title : bookData.title,
            category : bookData?.category?._id,
            almirah : bookData?.almirah?._id,
            author : bookData?.author,
            publisher : bookData?.publisher,
            shelf : bookData?.shelf,
            edition  : bookData?.edition,
            description : bookData?.description

        });
        const { data: categoriesData } =
          await getAllCategoriesWithoutPagination();
        setCategories(categoriesData?.categories);
        const { data: almirahsData } = await getAllAlmirahsWithoutPagination();
        setAlmirahs(almirahsData?.almirahs);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div className="form">
      <h3 style={{ padding: "20px" }}>CẬP NHẬT</h3>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input__container__3">
            <div className="form-control">
              <label htmlFor="ISBN">ID</label>
              <input
                type="text"
                placeholder="Nhập ID"
                id="ISBN"
                required
                name="ISBN"
                value={formData.ISBN}
                onChange={hanldeInputChange}
              />
            </div>
            <div className="form-control">
              <label htmlFor="title">Tiêu đề</label>
              <input
                type="text"
                placeholder="Nhập tiêu đề"
                id="title"
                required
                name="title"
                value={formData.title}
                onChange={hanldeInputChange}
              />
            </div>
            {/* Category */}
            <div className="form-control">
              <label htmlFor="category">Thể loại</label>
              <select
                name="category"
                id="category"
                value={formData?.category}
                onChange={hanldeInputChange}
                className="bg__accent text__color"
                required
              >
                <option value="">Chọn thể loại</option>
                {categories?.map((i) => {
                  return (
                    <option key={i._id} value={i._id}>
                      {i.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* Almirah */}
            <div className="form-control">
              <label htmlFor="almirah">Tủ sách</label>
              <select
                name="almirah"
                id="almirah"
                value={formData?.almirah}
                onChange={hanldeInputChange}
                className="bg__accent text__color"
                required
              >
                <option value="">Chọn tủ sách</option>
                {almirahs?.map((i) => {
                  return (
                    <option key={i._id} value={i._id}>
                      {i.subject} ({i.number})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="author">Tác giả</label>
              <input
                type="text"
                placeholder="Nhập tác giả"
                id="author"
                required
                name="author"
                value={formData.author}
                onChange={hanldeInputChange}
              />
            </div>

            <div className="form-control">
              <label htmlFor="publisher">Nhà xuất bản(Tùy chọn)</label>
              <input
                type="text"
                placeholder="Nhập nhà xuất bản"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={hanldeInputChange}
              />  
            </div>

            <div className="form-control">
              <label htmlFor="image">Ảnh bìa(Tùy chọn)</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Chọn ảnh"
                id="image"
                name="image"
                onChange={hanldeInputChange}
              />
            </div>

            <div className="form-control">
              <label htmlFor="shelf">Kệ sách(Tùy chọn)</label>
              <select
                name="shelf"
                id="shelf"
                value={formData.shelf}
                onChange={hanldeInputChange}
                className="bg__accent text__color"
              >
                <option value="">|Chọn kệ sách</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="form-control">
              <label htmlFor="edition">Phiên bản(Tùy chọn)</label>
              <input
                type="text"
                placeholder="Nhập phiên bản"
                id="edition"
                name="edition"
                value={formData.edition}
                onChange={hanldeInputChange}
              />
            </div>
            {/* tags */}
          </div>
          <br />
          <div className="form-control">
            <label htmlFor="desc">Mô tả(Tùy chọn)</label>
            <textarea
              name="description"
              id="desc"
              cols="30"
              rows="3"
              placeholder="Nhập mô tả"
              value={formData.description}
              onChange={hanldeInputChange}
              className="bg__accent text__color"
            ></textarea>
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              Quay lại
            </button>
            <button className="btn btn__primary" type="submit">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
