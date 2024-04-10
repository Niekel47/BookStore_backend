const db = require("../../models/index");
const OrderService = require("./order.service");

class OrderController {
  static addorder = async (req, res) => {
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
      const { name, status } = req.body;
      const updateCat = await OrderService.updateOrder(id, { name, status });
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

  static addOrder = async (req, res) => {
    try {
      let cart = req.body.cart;
      let userOrder = req.body.user;
      if (cart.length === 0) {
        return res.status(400).json({
          detail: "Vui lòng thêm sản phẩm vào giỏ hàng để đặt hàng !",
        });
      } else {
        if (
          !req.body.user.name ||
          !req.body.user.phone ||
          !req.body.user.payment ||
          !req.body.user.address
        ) {
          return res.status(400).json({
            detail: "Vui lòng điền đầy đủ thông tin đặt hàng !",
          });
        } else {
          if (req.body.user.payment == "off") {
            await OrderService.orderOff(cart, userOrder);
            return res.status(200).json({
              success: true,
              payment: "Thanh toán khi nhận hàng",
              message: "Đặt hàng thành công !",
            });
          }
          if (req.body.user.payment == "paypal") {
            await OrderService.orderOnl(cart, userOrder);
            return res.status(200).json({
              success: true,
              payment: "Thanh toán paypal",
              message: "Đặt hàng thành công !",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static getOrderWait = async (req, res) => {
    try {
      let user_id = req.params.user_id;
      let data = await db.Order.findAll({
        include: [
          {
            model: db.OrderProduct,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price"],
                required: true,
              },
            ],
          },
        ],
        where: {
          UserId: user_id,
          status: 0,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Thông tin đơn hàng đang chờ duyệt !",
        orders: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static getOrderShip = async (req, res) => {
    try {
      let user_id = req.params.user_id;
      let data = await db.Order.findAll({
        include: [
          {
            model: db.OrderProduct,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price"],
                required: true,
              },
            ],
          },
        ],
        where: {
          UserId: user_id,
          status: 1,
        },
      });
      return res.status(200).json({
        message: "Thông tin đơn hàng đang vận chuyển !",
        orders: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static getOrderComplete = async (req, res) => {
    try {
      let user_id = req.params.user_id;
      let data = await db.Order.findAll({
        include: [
          {
            model: db.OrderProduct,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price"],
                required: true,
              },
            ],
          },
        ],
        where: {
          UserId: user_id,
          status: 2,
        },
      });
      // let listRate = [];
      // for (const order of data) {
      //   for (const orderProduct of order.Order_Products) {
      //     let rate = await db.Rate.findOne({
      //       where: {
      //         OrderId: order.id,
      //         ProductId: orderProduct.ProductId,
      //       },
      //     });
      //     if (rate) {
      //       listRate.push(rate);
      //     }
      //   }
      // }
      return res.status(200).json({
        success: true,
        message: "Thông tin đơn hàng đã nhận !",
        orders: data,
        // rates: listRate,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi lấy thông tin đơn hàng.",
      });
    }
  };

  static getOrderCancel = async (req, res) => {
    try {
      let user_id = req.params.user_id;
      let data = await db.Order.findAll({
        include: [
          {
            model: db.OrderProduct,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price"],
                require: true,
              },
            ],
          },
        ],
        where: {
          UserId: user_id,
          status: 3,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Thông tin đơn hàng đã hủy !",
        orders: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static handleCancelOrder = async (req, res) => {
    try {
      let order_id = req.params.order_id;
      await db.Order.update(
        {
          status: 3,
        },
        {
          where: {
            id: order_id,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Hủy đơn hàng thành công !",
      });
    } catch (error) {
      console.log(error);
    }
  };

  static handleUpdateConfirm = async (req, res) => {
    try {
      let order_id = req.params.order_id;
      await db.Order.update(
        {
          status: 2,
        },
        {
          where: {
            id: order_id,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Xác nhận đã nhận đơn hàng thành công !",
      });
    } catch (error) {
      console.log(error);
    }
  };

  static confirmOrder = async (req, res) => {
    try {
      const order_id = req.params.order_id;
      const order = await db.Order.findOne({
        where: {
          id: order_id,
        },
      });
      if (!order) {
        return res.status(404).json({
          detail: "Không tồn tại đơn hàng",
        });
      }
      await db.Order.update(
        {
          status: 1,
        },
        {
          where: {
            id: order_id,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Duyệt đơn hàng thành công",
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = OrderController;
