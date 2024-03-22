const db = require("../../models/index");

class OrderController {
  static addOrder = async (req, res) => {
    try {
      let cart = req.body.cart;
      let userOrder = req.body.user;
      if (
        !req.body.user.name ||
        !req.body.user.phone ||
        !req.body.user.address
      ) {
        return res.status(400).json({
          detail: "Vui lòng điền đầy đủ thông tin đặt hàng !",
        });
      } else {
        if (req.body.user.payment == "off") {
          await orderOff(cart, userOrder);
          return res.status(200).json({
            success: true,
            payment: "Thanh toán khi nhận hàng",
            message: "Đặt hàng thành công !",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static orderOff = async (cart, userOrder) => {
    try {
      let total = 0;
      for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].cartQuantity;
      }
      let orderInsert = await db.Order.create({
        payment: "Thanh toán khi nhận hàng",
        status: 0,
        name: userOrder.name,
        address: userOrder.address,
        phone: userOrder.phone,
        total: total,
        UserId: userOrder.user_id,
      });
      for (let i = 0; i < cart.length; i++) {
        await db.Order_Product.create({
          ProductId: cart[i].id,
          OrderId: orderInsert.id,
          quantity: cart[i].cartQuantity,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // static orderOnl = async (cart, userOrder) => {
  //   try {
  //     let total = 0;
  //     for (let i = 0; i < cart.length; i++) {
  //       total += cart[i].price * cart[i].cartQuantity;
  //     }
  //     let orderInsert = await db.Order.create({
  //       payment: "Thanh toán PayPal",
  //       status: 0,
  //       name: userOrder.name,
  //       address: userOrder.address,
  //       phone: userOrder.phone,
  //       total: total,
  //       UserId: userOrder.user_id,
  //     });
  //     for (let i = 0; i < cart.length; i++) {
  //       await db.Order_Product.create({
  //         ProductId: cart[i].id,
  //         OrderId: orderInsert.id,
  //         quantity: cart[i].cartQuantity,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  static getOrderWait = async (req, res) => {
    try {
      let user_id = req.params.user_id;
      let data = await db.Order.findAll({
        include: [
          {
            model: db.Order_Product,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price", "sale"],
                require: true,
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
            model: db.Order_Product,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price", "sale"],
                require: true,
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
            model: db.Order_Product,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price", "sale"],
                require: true,
              },
            ],
          },
        ],
        where: {
          UserId: user_id,
          status: 2,
        },
      });
      let listRate = [];
      for (const order of data) {
        for (const orderProduct of order.Order_Products) {
          let rate = await db.Rate.findOne({
            where: {
              OrderId: order.id,
              ProductId: orderProduct.ProductId,
            },
          });
          if (rate) {
            listRate.push(rate);
          }
        }
      }
      return res.status(200).json({
        success: true,
        message: "Thông tin đơn hàng đã nhận !",
        orders: data,
        rates: listRate,
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
            model: db.Order_Product,
            attributes: ["id", "OrderId", "ProductId", "quantity"],
            include: [
              {
                model: db.Product,
                attributes: ["name", "image", "price", "sale"],
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
}

module.exports = OrderController;
