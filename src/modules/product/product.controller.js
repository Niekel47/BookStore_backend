const ProductService = require("./product.service.js");
const fs = require("fs");

class ProductController {
  static async createProduct(req, res) {
    try {
      const {
        name,
        price,
        quantity,
        description,
        AuthorId,
        PublisherId,
        CategoryIds, // Thay đổi tên biến này từ CategoryId sang CategoryIds
      } = req.body;
      let image = "";
      if (req.file) {
        image = req.file.originalname;
      }
      if (!name) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu điền tên sản phẩm!",
        });
      }
      if (!image) {
        fs.unlinkSync(req.file.path);
        return res.status(200).json({
          success: false,
          detail: "Vui lòng chọn ảnh sản phẩm",
        });
      }
      if (!price) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu dien gia sản phẩm!",
        });
      }
      if (!description) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu điền mô tả sản phẩm!",
        });
      }
      if (!quantity) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu chọn số lượng sản phẩm!",
        });
      }
      if (!AuthorId) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu chọn tác giả sản phẩm!",
        });
      }
      if (!PublisherId) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu chọn tác giả sản phẩm!",
        });
      }
      if (!CategoryIds) {
        return res.status(400).json({
          status: "ERR",
          message: "Yêu cầu chọn danh mục sản phẩm!",
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
        CategoryIds,
      });

      return res.status(200).json(newProduct);
    } catch (e) {
      console.log(e);
      // fs.unlinkSync(req.file.path);
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
      const {
        name,
        price,
        quantity,
        description,
        CategoryIds,
        AuthorId,
        PublisherId,
      } = req.body;
      let image = "";
      if (req.file) {
        image = req.file.originalname;
      }
      if (!image) {
        fs.unlinkSync(req.file.path);
        return res.status(200).json({
          success: false,
          detail: "Vui lòng chọn ảnh sản phẩm",
        });
      }
      console.log("image", image);
      const imagePath = "/images/" + image;
      const response = await ProductService.updateProduct(id, {
        name,
        price,
        quantity,
        description,
        CategoryIds,
        AuthorId,
        PublisherId,
        image: imagePath,
      });

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
