import React from "react";
import Hero from "../../components/website/hero/Hero";
import image from "../../assets/hero.jpg";

const AboutUs = () => {
  return (
    <div className="bg text__color">
      <Hero
        title="Giới thiệu"
        text={
          "Thư viện là những nơi tuyệt vời để tụ họp học tập và tiến hành nghiên cứu học thuật, học hỏi và sử dụng công nghệ thông tin. Thư viện của Trường Đại Học Công Nghệ là cánh cổng mở ra thông tin và tri thức. Trường có một hệ thống thư viện rất phong phú."
        }
        image={"https://ussh.vnu.edu.vn/uploads/ussh/news/2020_10/ai7i7109-20201015123910398.jpg"}

        reverse={true}
      />

      <Hero
        title="Sứ mệnh"
        text={
          "Sứ mệnh của Thư viện UET là đạt được sự xuất sắc trong việc cung cấp và thúc đẩy các dịch vụ thông tin để đáp ứng nhu cầu nghiên cứu, giảng dạy và học tập của Trường Đại Học. Chúng tôi cam kết giúp đỡ sinh viên và giảng viên tận dụng tối đa các tài nguyên này. Việc sử dụng hiệu quả các tài nguyên thông tin là điều kiện tiên quyết cần thiết cho thành công học thuật và suốt cả cuộc đời. Mục tiêu của chúng tôi tại các thư viện là cung cấp dịch vụ xuất sắc cho sinh viên và giảng viên, nhằm nâng cao trải nghiệm học tập, giảng dạy và nghiên cứu của mỗi người dùng tại Trường Đại Học Công Nghệ"
        }
        image={"https://ussh.vnu.edu.vn/uploads/ussh/news/2020_10/screenshot-56-20201007100952821.png"}

      />

      <Hero
        title="Bộ sưu tập"
        text={
          "Kho tàng tài liệu học thuật của Thư viện UET phục vụ nhu cầu của Cộng đồng Trường Đại Học, bao gồm sinh viên, nhân viên, giảng viên/nghiên cứu viên và các nhà nghiên cứu đến thăm. Tổng số tài liệu của tất cả các thư viện khoảng 25.000 đầu sách. Các thư viện có quy mô và số lượng tài liệu rất đa dạng, nhưng đều có các bộ sưu tập được tổ chức tốt và có giá trị đáng kể. Bộ sưu tập sách của chúng tôi bao gồm các ấn bản hiếm, các cuốn sách tham khảo, các hướng dẫn chuyên môn và các ấn phẩm mới nhất. Chúng tôi cũng có một bộ sưu tập lớn các tạp chí/nghiên cứu, bao gồm cả các tạp chí chuyên ngành."
        }
        image={"https://dlcorp.com.vn/wp-content/uploads/2020/12/a1_2.jpg"}
        reverse={true}
      />

      <Hero
        title="Truy cập / Tiện ích"
        text={
          "Hầu hết các thư viện đều có hệ thống kệ mở và người dùng có thể tự do truy cập tài liệu thư viện. Các máy tính có kết nối đến tài nguyên thư viện và Internet thường có sẵn trong các thư viện. Truy cập nghiên cứu có sẵn cho toàn bộ Cộng đồng Trường Đại học dưới dạng các danh mục, tài nguyên thư viện có giấy phép và các trang web. Ưu tiên sử dụng được dành cho sinh viên, giảng viên và nhân viên đang thực hiện nghiên cứu. Nhân viên thư viện có trách nhiệm tư vấn và hướng dẫn người dùng. Thông tin về chính sách sử dụng thư viện có sẵn tại các quầy lưu thông của thư viện."
        }
        image={"https://www.vnu.edu.vn/upload/2020/02/25371/image/LIC%202019.jpg"}
      />
    </div>
  );
};

export default AboutUs;
