const db = require("../../models/index");

class OrderService {
  static addOrder = async (newOrder) => {
    try {
      const { payment, status, name, address, phone, total, UserId } = newOrder;
      const checkOrder = await db.Order.findOne({ where: { name } });
      if (checkOrder) {
        return {
          status: "err",
          message: "Đơn hàng đã tồn tại",
        };
      }

      const NewOrder = db.Order.create({
        payment,
        status,
        name,
        address,
        phone,
        total,
        UserId,
      });

      return NewOrder;
    } catch (error) {
      console.log(error);
    }
  };

  static async getAllOrder(req, res) {
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
            { fullname: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      }
      const totalOrder = await db.Order.count(options.where);
      const totalPagesOrder = Math.ceil(totalOrder / limit);
      // Thực hiện truy vấn để lấy danh sách người dùng với các tùy chọn đã được đặt
      const getallOrder = await db.Order.findAll(options);
      return {
        totalOrder,
        totalPagesOrder,
        getallOrder,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateOrder(id, req, res) {
    try {
      const { name } = req.body;
      const existingCat = await db.Order.findByPk(id);
      if (!existingCat) {
        return res.status(404).json({
          error: "Order không tồn tại.",
        });
      }

      const updateCat = await db.Order.update(
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

  static async deleteOrder(id, req, res) {
    try {
      const existingCat = await db.Order.findByPk(id);
      if (!existingCat) {
        return res.status(404).json({
          error: "Order không tồn tại.",
        });
      }
      const destroy = await db.Order.destroy({ where: { id } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyOrders(ids) {
    try {
      const destroy = await db.Order.destroy({ where: { id: ids } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = OrderService;