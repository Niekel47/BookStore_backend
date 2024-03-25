const AuthService = require("./auth.service.js");

class AuthController {
  static createUser = async (req, res) => {
    try {
      const { fullname, email, password, phone, addres } = req.body;

      const user = await AuthService.createuser(req.body);
      console.log("data", user);
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static loginUser = async (req, res) => {
    try {
      const login = await AuthService.loginuser(req.body);
      return res.status(200).json(login);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static handleAuth = async (req, res) => {
    try {
      const authtoken = await AuthService.handleAuth(req.body);
      return res.status(200).json(authtoken);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static async profile(req, res, next) {
    try {
      console.log(req.auth?.payload);
      const { id } = req.auth?.payload || "";
      console.log(req.auth);
      const data = await AuthService.profile(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async updateprofile(req, res) {
    try {
      const id = req.auth?.payload?.id || "";
      const { fullname, email, phone } = req.body;
      const user = await AuthService.updateprofile(id, {
        fullname,
        email,
        phone,
      });
      user.fullname = fullname;
      user.email = email;
      user.phone = phone;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const id = req.auth?.payload?.id;
      const { old_password, new_password } = req.body;

      // Gọi service để thực hiện cập nhật mật khẩu

      const updatedUser = await AuthService.updatePassword(
        id,
        old_password,
        new_password
      );

      return res.status(200).json({
        message: "Doi mat khau thanh cong",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
}

module.exports = AuthController;
