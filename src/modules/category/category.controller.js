const CategoryService = require("./category.service.js");

 class CategoryController {
  static createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const create_category = await CategoryService.createCategory(req.body);
      return res.status(200).json(create_category);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  static async getAllCategory(req, res) {
    try {
      const allcategory = await CategoryService.getAllCategory(req, res);
      res.status(200).json(allcategory);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateCat = await CategoryService.updateCategory(id, req, res);
      res.status(200).json(updateCat);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id, req, res);
      res.status(200).json({ message: "Category đã được xóa thành công." });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyCategory(req, res) {
    try {
      const { ids } = req.body; // Lấy danh sách các id cần xóa từ request body
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: "Danh sách id không hợp lệ.",
        });
      }
      const destroyCount = await CategoryService.deleteManyCategorys(ids);

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

module.exports = CategoryController;