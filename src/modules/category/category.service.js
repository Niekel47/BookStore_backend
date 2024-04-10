const Category = require("../../models/category.js");
const db = require("../../models/index");
const { Op } = require("sequelize");

class CategoryService {
  static createCategory = async (newcategory) => {
    try {
      const { name } = newcategory;
      console.log("data", newcategory);
      const check_cat = await db.Category.findOne({ where: { name: name } });
      if (check_cat) {
        return {
          status: "Err",
          message: "Category đã tồn tại!",
        };
      }
      const create_category = await db.Category.create({
        name: name,
      });
      return {
        status: 200,
        message: "Thanh cong",
        data: create_category,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  static async getAllCategory(req, res) {
    try {
      const { page, limit = 5, sort, search } = req.query;
      // Tùy chỉnh truy vấn dựa trên các tham số được truyền vào từ client
      const options = {
        order: [],
        where: {},
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
            // { id: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } },
          ],
        };
      }
      const totalCat = await db.Category.count(options.where);
      const totalPagesCat = Math.ceil(totalCat / limit);
      // Thực hiện truy vấn để lấy danh sách người dùng với các tùy chọn đã được đặt
      const getallcat = await db.Category.findAll(options);
      return {
        totalCat,
        totalPagesCat,
        getallcat,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateCategory(id, req, res) {
    try {
      const { name } = req.body;
      const existingCat = await db.Category.findByPk(id);
      if (!existingCat) {
        return res.status(404).json({
          error: "Category không tồn tại.",
        });
      }

      const updateCat = await db.Category.update(
        {
          name,
        },
        { where: { id } }
      );

      return updateCat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteCategory(id, req, res) {
    try {
      const existingCat = await db.Category.findByPk(id);
      if (!existingCat) {
        return res.status(404).json({
          error: "Category không tồn tại.",
        });
      }
      const destroy = await db.Category.destroy({ where: { id } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyCategorys(ids) {
    try {
      const destroy = await db.Category.destroy({ where: { id: ids } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = CategoryService;
