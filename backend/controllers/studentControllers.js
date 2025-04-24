import UserModel from "../models/user-model.js";
import {
  ErrorHandlerService,
  paginationService,
  sendMail,
} from "../services/index.js";
import { studentValidationSchema } from "../services/validation-service.js";
import bcrypt from "bcrypt";

import csv from "fast-csv";
import fs from "fs";
import { ROOT_PATH } from "../server.js";
import { BASE_URL } from "../config/index.js";

class StudentController {
  async createStudent(req, res, next) {
    /* VALIDATE REQUEST */
    const { error } = studentValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      /* CHECK EMAIL OR ROLL NUMBER IS ALREADY EXIST (SHOULD BE UNIQUE) */
      const isEmailExist = await UserModel.findOne({ email: req.body.email });
      if (isEmailExist) {
        return next(
          ErrorHandlerService.alreadyExist("Email đã được sử dụng")
        );
      }
      const isRollNumberExist = await UserModel.findOne({
        rollNumber: req.body.rollNumber,
      });
      if (isRollNumberExist) {
        return next(
          ErrorHandlerService.alreadyExist("Số điện thoại đã tồn tại")
        );
      }

      /* GENRATE RANDOM PASSWORD */
      const password = "123456";
      /* HASHED PASSWORD */
      const hashedPassword = await bcrypt.hash(password, 10);
      const student = new UserModel({ ...req.body, password: hashedPassword });
      await student.save();

      res.status(200).json({ student });
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
      return next(error);
    }
  }

  async getStudents(req, res, next) {
    const { page, limit, skip } = paginationService(req);
    let totalPages;
    /* SEARCH QUERY */
    const regexQueryEmail = new RegExp(req.query.qEmail || "", "i");
    const regexQueryName = new RegExp(req.query.qName || "", "i");
    const regexQueryRollNumber = new RegExp(req.query.qRollNumber || "", "i");
    const filter = [
      { role: "Student" },
      { name: { $regex: regexQueryName } },
      { email: { $regex: regexQueryEmail } },
      { rollNumber: { $regex: regexQueryRollNumber } },
    ];

    try {
      const [students, totalRecords] = await Promise.all(
        [
          UserModel.find({ $and: filter }, "-__v -password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec(),
          UserModel.countDocuments({ $and: filter }).exec(),
        ]
      );
      totalPages = Math.ceil(totalRecords / limit);
      return res
        .status(200)
        .json({
          students,
          page,
          limit,
          totalRecords,
          totalPages,
        });
    } catch (error) {
      next(error);
    }
  }

  async getStudent(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findById(_id, "-__v -password")
        .populate( "-__v -hod")
      if (!document) {
        return next(ErrorHandlerService.notFound("Không tìm thấy sinh viên"));
      }
      return res.status(200).json({ student: document });
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req, res, next) {
    const { _id } = req.params;
    try {
      /* VALIDATE REQEST */
      const { error } = studentValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const document = await UserModel.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!document) {
        return next(ErrorHandlerService.notFound("Không tìm thấy sinh viên"));
      }

      return res.status(200).json({ student: document });
    } catch (error) {
      next(error);
    }
  }

  async deleteStudent(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findByIdAndDelete(_id);
      if (!document) {
        return next(ErrorHandlerService.notFound("Không tìm thấy sinh viên"));
      }
      res.status(204).json({ student: document });
    } catch (error) {
      next(error);
    }
  }

  async exportStudents(req, res, next) {
    try {
      const data = await UserModel.find({ role: "Student" })
      if (data.length === 0) {
        return next(ErrorHandlerService.notFound("Không  tìm thấy sinh viên"));
      }

      const csvStream = csv.format({ headers: true });
      const filePath = `${ROOT_PATH}/public/files/export/students.csv`;
      const writablestream = fs.createWriteStream(filePath);
      csvStream.pipe(writablestream);
      writablestream.on("finish", function () {
        res.json({
          downloadUrl: `${BASE_URL}/public/files/export/students.csv`,
        });
      });

      if (data.length > 0) {
        data.map((i, index) => {
          csvStream.write({
            SNo: index + 1,
            Name: i.name || "-",
            "Roll Number": i.rollNumber || "-",
            Email: i.email || "-",
            "Account Status": i.accountStatus,
          });
        });
      }
      csvStream.end();
      writablestream.end();
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();
