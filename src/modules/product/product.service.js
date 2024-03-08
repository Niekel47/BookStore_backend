const Product = require("../../models/product.js");
const Author = require("../../models/author.js");
const Publisher = require("../../models/publisher.js");
const Category = require("../../models/category.js");
const Product_Category = require("../../models/product_category.js");
const db = require("../../models/index");

class ProductService {
  static async createproduct(productData, CategoryIds) {
    try {
      const {
        AuthorId,
        PublisherId,
        name,
        price,
        image,
        quantity,
        description,
        status,
        CategoryId,
      } = productData;

      // Kiểm tra xem CategoryId có phải là mảng không
      // const categoryIdArray = Array.isArray(CategoryId)
      //   ? CategoryId
      //   : [CategoryId];

      // Kiểm tra xem sản phẩm đã tồn tại chưa
      const checkProduct = await db.Product.findOne({
        where: { name: name },
      });
      if (checkProduct !== null) {
        return {
          status: "ERR",
          message: "Tên của sản phẩm đã tồn tại",
        };
      }

      // Tạo sản phẩm mới
      const newProduct = await db.Product.create({
        AuthorId: AuthorId,
        PublisherId: PublisherId,
        CategoryId: CategoryId,
        name: name,
        image: image,
        price: price,
        quantity: quantity,
        description: description,
        status: status,
      });

      // Tạo các bản ghi trong bảng trung gian Product_Category

      await db.Product_Category.create({
        ProductId: newProduct.id,
        CategoryId: CategoryId,
      });

      return {
        newProduct,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAllproducts(req, res) {
    try {
      const { page, limit = 5, sort, search } = req.query;
      // Tùy chỉnh truy vấn dựa trên các tham số được truyền vào từ client
      const options = {
        order: [],
        where: {},
        include: [
          { model: db.Author, attributes: ["name"] },
          { model: db.Publisher, attributes: ["name"] },
          {
            model: db.Category,
            attributes: ["name"],
            through: { attributes: [] }, // Bỏ qua bảng trung gian
          },
        ],
      };
      // Xử lý phần trang
      if (page && limit) {
        const offset = (page - 1) * limit;
        options.offset = offset;
        options.limit = limit;
      }

      // Xử lý phần sắp xếp
      if (sort) {
        const [field, order] = sort.split(":");
        options.order.push([field, order]);
      }

      // Xử lý phần tìm kiếm
      if (search) {
        options.where = {
          [Op.or]: [
            { fullname: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      }
      const totalProducts = await db.Product.count(options.where);
      const totalPages = Math.ceil(totalProducts / limit);
      // Thực hiện truy vấn để lấy danh sách người dùng với các tùy chọn đã được đặt
      const products = await db.Product.findAll(options);
      return {
        totalProducts,
        totalPages,
        products,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateproduct(id, data) {
    try {
      const checkProduct = await db.Product.findByPk(id);
      if (checkProduct == null) {
        return {
          status: "ERR",
          message: "Sản phẩm không tồn tại",
        };
      }
      const updatedProduct = await db.Product.update(data, {
        where: { id: id },
      });
      return {
        status: "OK",
        message: "thanh cong",
        data: updatedProduct,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteproduct(id, req, res) {
    try {
      const existingProduct = await db.Product.findByPk(id);
      if (!existingProduct) {
        return res.status(404).json({
          error: "Sản phẩm không tồn tại.",
        });
      }
      const destroy = await db.Product.destroy({ where: { id } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getproductById(id, req, res) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu với id được cung cấp
      const product = await db.Product.findByPk(id);
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteManyProduct(ids) {
    try {
      const destroy = await db.Product.destroy({ where: { id: ids } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = ProductService;
