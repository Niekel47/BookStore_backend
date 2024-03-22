const bcrypt = require("bcrypt");
const {
  genneralAccessToken,
  genneralRefreshToken,
  verifyToken,
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
      const comparePassword = bcrypt.compare(password, checkuser.password);
      if (!comparePassword) {
        return {
          status: "ERR",
          message: "Mật khẩu hoặc tài khoản không đúng",
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

  static handleAuth = async (req, res) => {
    try {
      if (req.headers.Authorization) {
        let token = req.headers.Authorization;
        let data_token = verifyToken(token);
        let user = await db.User.findOne({
          where: {
            id: data_token.id,
            username: data_token.username,
            email: data_token.email,
          },
        });
        if (user) {
          let dataUser = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
          };
          return res.status(200).json({
            success: true,
            message: "Xác thực đăng nhập thành công !",
            user: dataUser,
          });
        } else {
          return res.status(200).json({
            detail: "Vui lòng hãy đăng nhập !",
          });
        }
      } else {
        return res.status(200).json({
          detail: "Vui lòng hãy đăng nhập !",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // static handleAuthToken = async (req, res) => {
  //   try {
  //     // console.log("token:", req.params.token);
  //     if (req.params.token) {
  //       let token = req.params.token;
  //       let data_token = verifyToken(token);
  //       let user = await db.User.findOne({
  //         where: {
  //           id: data_token.id,
  //           username: data_token.username,
  //           email: data_token.email,
  //         },
  //       });
  //       if (user) {
  //         let dataUser = {
  //           id: user.id,
  //           name: user.name,
  //           username: user.username,
  //           email: user.email,
  //         };
  //         return res.status(200).json({
  //           success: true,
  //           message: "Xác thực đăng nhập thành công !",
  //           user: dataUser,
  //         });
  //       } else {
  //         return res.status(200).json({
  //           detail: "Vui lòng hãy đăng nhập !",
  //         });
  //       }
  //     } else {
  //       return res.status(200).json({
  //         detail: "Vui lòng hãy đăng nhập !",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  static async profile(id) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu với id được cung cấp
      console.log(id);
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

  static verifyToken = (token) => {
    let decoded = null;
    let key = process.env.JWT_SECRET;
    let data = null;
    try {
      decoded = jwt.verify(token, key);
      data = decoded;
    } catch (error) {
      console.log(error);
    }
    return data;
  };
  static handleAuthToken = async (req, res) => {
    try {
      if (req.params.token) {
        let token = req.params.token;
        let data_token = verifyToken(token);
        let user = await db.User.findOne({
          where: {
            id: data_token.id,
            RoleId: data_token.role_id,
          },
        });
        if (user) {
          let dataUser = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
          };
          return res.status(200).json({
            success: true,
            message: "Xác thực đăng nhập thành công !",
            user: dataUser,
          });
        } else {
          return res.status(200).json({
            detail: "Vui lòng hãy đăng nhập !",
          });
        }
      } else {
        return res.status(200).json({
          detail: "Vui lòng hãy đăng nhập !",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AuthService;
