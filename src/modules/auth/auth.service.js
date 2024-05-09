const bcrypt = require("bcrypt");
const {
  genneralAccessToken,
  genneralRefreshToken,
} = require("../../middleware/auth.middleware.js");
const db = require("../../models/index");
const { createJWT } = require("../../middleware/auth.middleware.js");

class AuthService {
  // AuthService.js
  static createuser = async (newuser) => {
    try {
      const { fullname, email, password, phone, address } = newuser;

      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      const existingUser = await db.User.findOne({ where: { email: email } });
      if (existingUser) {
        return {
          status: "Err",
          message: "Email đã tồn tại!",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.User.create({
        fullname: fullname,
        email: email,
        password: hashedPassword,
        phone: phone,
        address: address,
        RoleId: 2,
        status: 2,
      });

      return {
        status: 200,
        message: "Thành công",
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static loginuser = async (userLogin) => {
    try {
      const { email, password } = userLogin;
      const checkuser = await db.User.findOne({ where: { email: email } });

      if (!checkuser) {
        return {
          status: "ERR",
          message: "user không tồn tại",
        };
      }
      if (checkuser.RoleId === 1) {
        return {
          status: "ERR",
          message: "Vui lòng chọn tài khoản khác",
        };
      }
      const comparePassword = await bcrypt.compare(password, checkuser.password);
      if (!comparePassword) {
        return {
          status: "ERR",
          message: "Mật khẩu không đúng! Vui lòng nhập lại mật khẩu",
        };
      }
      const access_token = await genneralAccessToken({
        id: checkuser.id,
        email: checkuser.email,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkuser.id,
        email: checkuser.email,
      });

      return {
        status: "OK",
        message: "Thành công",
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static loginAdmin = async (adminlogin) => {
    try {
      const { email, password } = adminlogin;
      const checkuser = await db.User.findOne({ where: { email: email } });

      if (!checkuser) {
        return {
          status: "ERR",
          message: "user không tồn tại",
        };
      }
      if (checkuser.RoleId === 1) {
        const comparePassword = await bcrypt.compare(password, checkuser.password);
        if (!comparePassword) {
          return {
            status: "ERR",
            message: "Mật khẩu không đúng! Vui lòng nhập lại mật khẩu",
          };
        }
        const access_token = await genneralAccessToken({
          id: checkuser.id,
          email: checkuser.email,
        });
        const refresh_token = await genneralRefreshToken({
          id: checkuser.id,
          email: checkuser.email,
        });

        return {
          status: "OK",
          message: "Xin chào ADMIN",
          access_token,
          refresh_token,
        };
      } else {
        return {
          status: "Err",
          message: "Bạn không có quyền truy cập",
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static async profileAdmin(id) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu với id được cung cấp
      const user = await db.User.findByPk(id);
      if (!user) {
        return {
          status: 500,
          message: "Nguoi dung khong ton tai",
        };
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async profile(id) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu với id được cung cấp
      const user = await db.User.findByPk(id);
      if (!user) {
        return {
          status: 500,
          message: "Nguoi dung khong ton tai",
        };
      }
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateprofile(id) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu với id được cung cấp
      const user = await db.User.findByPk(id);
      if (!user) {
        return {
          status: 500,
          message: "Nguoi dung khong ton tai",
        };
      }

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async updatePassword(id, old_password, new_password) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await db.User.findByPk(id);
      if (!user) {
        throw new Error("Người dùng không tồn tại");
      }
      const isValidOldPassword = await bcrypt.compare(
        old_password,
        user.password
      );
      if (!isValidOldPassword) {
        throw new Error("Mật khẩu cũ không đúng");
      }
      if (old_password === new_password) {
        throw new Error("Vui lòng nhập mật khẩu mới khác mật khẩu cũ");
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await user.update({ password: hashedPassword });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = AuthService;
