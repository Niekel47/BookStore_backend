const ProductService = require("./product.service.js");

class ProductController {
  static async createProduct(req, res) {
    try {
      const {
        name,
        image,
        price,
        quantity,
        description,
        AuthorId,
        PublisherId,
        CategoryIds, // Thay đổi tên biến này từ CategoryId sang CategoryIds
      } = req.body;

      if (
        !name ||
        !image ||
        !price ||
        !description ||
        !quantity ||
        !AuthorId ||
        !PublisherId ||
        !CategoryIds
      ) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu điền hết thông tin!",
        });
      }

      const imagePath = "/images/" + image;

      const newProduct = await ProductService.createproduct({
        name,
        image: imagePath,
        price,
        quantity,
        description,
        status: 2,
        AuthorId,
        PublisherId,
        CategoryIds, // Sửa thành CategoryIds
      });

      return res.status(200).json(newProduct);
    } catch (e) {
      return res.status(500).json({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi trong quá trình xử lý",
      });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const getallProduct = await ProductService.getAllproducts(req, res);
      res.status(200).json(getallProduct);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const response = await ProductService.updateProduct(id, data);

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "ERR",
        message: "Đã xảy ra lỗi trong quá trình xử lý",
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await ProductService.deleteproduct(id, req, res);
      res.status(200).json({ message: "Sản phẩm đã được xóa thành công." });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getproductById(id);
      if (!product) {
        return res.status(500).json({ error: "Sản phẩm không tồn tại." });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteManyProduct(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: "Danh sách id không hợp lệ.",
        });
      }

      await ProductService.deleteManyProduct(ids);

      res.status(200).json({
        message: ` thành công.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = ProductController;
