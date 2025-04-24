import UserModel from "../models/user-model.js";
import {
  ErrorHandlerService,
  sendMail,
  paginationService,
  exportToCSV,
} from "../services/index.js";
import { teacherValidationSchema } from "../services/validation-service.js";
import bcrypt from "bcrypt";

class TeacherController {
  async createTeacher(req, res, next) {
    try {
      /* VALIDATE REQUEST */
      const { error } = teacherValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }

      /* CHECK EMAIL ALREADY EXISTS ? */
      const isExist = await UserModel.findOne({ email: req.body.email });
      if (isExist) {
        return next(ErrorHandlerService.alreadyExist("Email đã tồn tại"));
      }

      /* GENRATE RANDOM PASSWORD */
      const password = "123456";
      /* HASHED PASSWORD */
      const hashedPassword = await bcrypt.hash(password, 10);

      /* SAVE INTO DATABASE */
      const teacher = new UserModel({
        ...req.body,
        password: hashedPassword,
        role: "Teacher",
      });
      await teacher.save();

      res.status(200).json({ teacher });

      /* SEND WELCOME MAIL TO TEACHER AND ASK TO CHANGE THEIR PASSWORD */
      await sendMail({
        to: req.body.email,
        subject: `Chào mừng bạn đến với thư viện UET`,
        text: `Gửi ${req.body.name},
              
                Username/Email: ${req.body.email}
                Password: ${password}
              
                `,
      });
    } catch (error) {
      next(error);
    }
  }
  async getTeachers(req, res, next) {
    try {
      const { page, limit, skip } = paginationService(req);
      let totalPages;

      /* SEARCH FILTER */
      const regexQueryEmail = new RegExp(req.query.qEmail || "", "i");
      const regexQueryName = new RegExp(req.query.qName || "", "i");
      const filter = [
        { $or: [{ role: "Teacher" }] },
        { name: { $regex: regexQueryName } },
        { email: { $regex: regexQueryEmail } },
      ];

      const [teachers, totalRecords] = await Promise.all([
        UserModel.find({ $and: filter }, "-__v -password")
          .skip(skip)
          .limit(limit)
          .exec(),
        UserModel.countDocuments({ $and: filter }),
      ]);

      totalPages = Math.ceil(totalRecords / limit);
      return res
        .status(200)
        .json({ teachers, page, limit, totalRecords, totalPages });
    } catch (error) {
      return next(error);
    }
  }

  async getTeacher(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findById(_id, "-__v -password");
      if (!document) {
        return next(ErrorHandlerService.notFound("Teacher not found"));
      }
      return res.status(200).json({ teacher: document });
    } catch (error) {
      next(error);
    }
  }

  async updateTeacher(req, res, next) {
    const { _id } = req.params;
    try {
      /* VALIDATE REQEST */
      const { error } = teacherValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const document = await UserModel.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!document) {
        return next(ErrorHandlerService.notFound("Không tìm thấy giảng viên"));
      }

      return res.status(200).json({ teacher: document });
    } catch (error) {
      next(error);
    }
  }

  async deleteTeacher(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findByIdAndDelete(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound("Không tìm thấy giảng viên"));
      }
      res.status(204).json({ teacher: document });
    } catch (error) {
      next(error);
    }
  }

  async exportTeachers(req, res, next) {
    try {
      const data = await UserModel.find({ role: "Teacher" });
      if (data.length === 0) {
        return next(ErrorHandlerService.notFound("Không tìm thấy dữ liệu"));
      }
      const columns = [
        { header: "Name", key: "name" },
        { header: "Email", key: "email" },
        { header: "Account Status", key: "accountStatus" },
      ];
      const fileName = "teachers.csv";
      exportToCSV(data, columns, fileName, res);
    } catch (error) {
      next(error);
    }
  }
}

export default new TeacherController();
