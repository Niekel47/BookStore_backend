const UserService = require("./user.service.js");
const { ListQueryReq } = require("../../function/req.query.js");

class UserController {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await UserService.getAllUsers(req, res);
      res.status(200).json(allUsers);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateUser(id, req, res);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id, req, res);
      res.status(200).json({ message: "Người dùng đã được xóa thành công." });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyUsers(req, res) {
    try {
      const { ids } = req.body; // Lấy danh sách các id cần xóa từ request body
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: "Danh sách id không hợp lệ.",
        });
      }

      // Gọi service để xóa các người dùng
      const destroyCount = await UserService.deleteManyUsers(ids);

      // Trả về số lượng bản ghi đã được xóa
      res.status(200).json({
        message: `${destroyCount} người dùng đã được xóa thành công.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
