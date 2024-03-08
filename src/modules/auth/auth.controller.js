const AuthService = require("./auth.service.js"); ;

 class AuthController {
  static createUser = async (req, res) => {
    try {
      const { fullname, email, password, phone, isAdmin } = req.body;
      const user = await AuthService.createuser(req.body);
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

  static async profile(req, res) {
    try {
      const { id } = req.params;
      const user = await AuthService.profile(id);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateprofile(req, res) {
    try {
      const { id } = req.params;
      const { fullname, email, phone } = req.body;
      const user = await AuthService.updateprofile(id, {
        fullname,
        email,
        phone,
      });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { old_password, new_password } = req.body;

      // Gọi service để thực hiện cập nhật mật khẩu
      const updatepassword = await AuthService.updatePassword(
        id,
        old_password,
        new_password
      );
      const updatedUser = await AuthService.profile(id);

      return res.status(200).json({
        message: "Doi mat khau thanh cong",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  // static changePassword = async (req, res, next) => {
  //   try {
  //     // Get user id & data update
  //     const id = req.user ? req.user.id : "";
  //     const { password, new_password } = req.body;
  //     // Update profile
  //     await AuthService.changepassword(id, { password, new_password });
  //     return res
  //       .status(200)
  //       .json({ message: "Password is changed successfully" });
  //   } catch (e) {
  //     return next(e);
  //   }
  // };
}

module.exports = AuthController;
