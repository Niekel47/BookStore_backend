const AuthorService = require("./author.service.js");

class AuthorController {
  static createAuthor = async (req, res) => {
    try {
      const { name } = req.body;
      const create_Author = await AuthorService.createAuthor(req.body);
      return res.status(200).json(create_Author);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  static async getAllAuthor(req, res) {
    try {
      const allAuthor = await AuthorService.getAllAuthor(req, res);
      res.status(200).json(allAuthor);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateAuthor(req, res) {
    try {
      const { id } = req.params;
      const updateCat = await AuthorService.updateAuthor(id, req, res);
      res.status(200).json(updateCat);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteAuthor(req, res) {
    try {
      const { id } = req.params;
      await AuthorService.deleteAuthor(id, req, res);
      res.status(200).json({ message: "Author đã được xóa thành công." });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyAuthor(req, res) {
    try {
      const { ids } = req.body; // Lấy danh sách các id cần xóa từ request body
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: "Danh sách id không hợp lệ.",
        });
      }
      const destroyCount = await AuthorService.deleteManyAuthors(ids);

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

module.exports = AuthorController;
