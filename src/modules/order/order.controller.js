const db = require("../../models/index");
const OrderService = require("./order.service")

class OrderController {
  static addOrder = async (req, res) => {
    try {
      const { payment, status, name, address, phone, total, UserId } = req.body;
      if (
        !payment ||
        !status ||
        !name ||
        !address ||
        !phone ||
        !total ||
        !UserId
      ) {
        return res.status(500).json({
          status: "Err",
          message: "Vui long dien day du thong tin",
        });
      }
      const AddOrder = await OrderService.addOrder({
        payment,
        status,
        name,
        address,
        phone,
        total,
        UserId,
      });

      return res.status(200).json(AddOrder);
    } catch (error) {
      console.log(error);
    }
  };

  static async getAllOrder(req, res) {
    try {
      const allOrder = await OrderService.getAllOrder(req, res);
      res.status(200).json(allOrder);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const updateCat = await OrderService.updateOrder(id, req, res);
      res.status(200).json(updateCat);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      await OrderService.deleteOrder(id, req, res);
      res.status(200).json({ message: "Order đã được xóa thành công." });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyOrder(req, res) {
    try {
      const { ids } = req.body; // Lấy danh sách các id cần xóa từ request body
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: "Danh sách id không hợp lệ.",
        });
      }
      const destroyCount = await OrderService.deleteManyOrders(ids);

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

module.exports = OrderController;
