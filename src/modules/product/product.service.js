const db = require("../../models/index");

class ProductService {
  static async createproduct(productData) {
    try {
      const {
        name,
        price,
        image,
        quantity,
        description,
        CategoryIds,
        AuthorId,
        PublisherId,
      } = productData;
      console.log("Category", productData);
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
        name,
        image,
        price,
        quantity,
        description,
        status: 2,
        AuthorId,
        PublisherId,
      });
      // const categoryIdsArray = [CategoryIds];
      let CategoryIdsNew = CategoryIds.replace(/[\[\]']+/g, "");
      const categoryIdsArray = CategoryIdsNew.split(",");
      console.log("categoryIdsArray", categoryIdsArray);
      // Tạo các bản ghi trong bảng trung gian Product_Category
      if (categoryIdsArray && categoryIdsArray.length > 0) {
        categoryIdsArray.map(async (CategoryId) => {
          await db.Product_Category.create({
            ProductId: newProduct.id,
            CategoryId: CategoryId,
          });
        });
      }

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
            through: { attributes: [] },
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

  static async updateProduct(id, data) {
    try {
      const {
        name,
        price,
        image,
        quantity,
        description,
        CategoryIds,
        AuthorId,
        PublisherId,
      } = data;
      const checkProduct = await db.Product.findByPk(id);
      if (!checkProduct) {
        return {
          status: "ERR",
          message: "Sản phẩm không tồn tại",
        };
      }

      // Lưu ID của sản phẩm trước khi cập nhật
      const productId = checkProduct.id;

      // Kiểm tra xem liệu có CategoryIds trong data không
      if ("CategoryIds" in data) {
        // Xóa tất cả các bản ghi liên quan đến sản phẩm trong bảng trung gian Product_Category
        await db.Product_Category.destroy({
          where: {
            ProductId: productId,
          },
        });

        // Convert CategoryIds from string to array
        let CategoryIdsNew = CategoryIds.replace(/[\[\]']+/g, "");
        const categoryIdsArray = CategoryIdsNew.split(",");

        // Thêm mới các bản ghi trong bảng trung gian Product_Category với các CategoryId mới
        await Promise.all(
          categoryIdsArray.map(async (CategoryId) => {
            await db.Product_Category.create({
              ProductId: productId,
              CategoryId: CategoryId,
            });
          })
        );

        // Xóa trường CategoryIds ra khỏi dữ liệu cập nhật sản phẩm
        delete data["CategoryIds"];
      }

      // Cập nhật thông tin sản phẩm với ID đã xác định
      const data_update = await db.Product.update(
        {
          name,
          image,
          price,
          quantity,
          description,
          AuthorId,
          PublisherId,
        },
        {
          where: { id: id },
        }
      );

      return {
        status: "OK",
        message: "Thành công",
        data_update,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteproduct(id) {
    try {
      const existingProduct = await db.Product.findByPk(id);
      if (!existingProduct) {
        return { status: 404, message: "Sản phẩm không tồn tại." };
      }

      // Xóa sản phẩm từ bảng Product
      await db.Product.destroy({ where: { id } });

      // Xóa tất cả các bản ghi liên quan đến sản phẩm trong bảng trung gian Product_Category
      await db.Product_Category.destroy({ where: { ProductId: id } });

      return { status: 200, message: "Sản phẩm đã được xóa thành công." };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getproductById(id, req, res) {
    try {
      // Tìm người dùng trong cơ sở dữ liệu với id được cung cấp
      const product = await db.Product.findByPk(id, {
        include: [
          { model: db.Author, attributes: ["name"] },
          { model: db.Publisher, attributes: ["name"] },
          {
            model: db.Category,
            attributes: ["name"],
            through: { attributes: [] }, // Bỏ qua bảng trung gian
          },
        ],
      });
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteManyProduct(ids) {
    try {
      // Xóa các sản phẩm từ bảng Product
      await db.Product.destroy({ where: { id: ids } });

      // Xóa tất cả các bản ghi liên quan đến các sản phẩm trong bảng trung gian Product_Category
      await db.Product_Category.destroy({ where: { ProductId: ids } });

      return { status: 200, message: "Các sản phẩm đã được xóa thành công." };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = ProductService;
