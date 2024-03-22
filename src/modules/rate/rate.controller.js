const db = require("../../models/index");

class RateController {
  static getProductRate = async (req, res) => {
    try {
      const product_id = req.params.product_id;
      if (rate) {
        return res.status(200).json({
          success: true,
          message: "Sản phẩm đã được đánh giá ",
        });
      } else {
        let product = await db.Product.findOne({
          where: {
            id: product_id,
          },
        });
        return res.status(200).json({
          success: true,
          product: product,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static handleRate = async (req, res) => {
    try {
      let { product_id, rating, comment } = req.body;
      if (!req.body.rating || !req.body.comment) {
        return res.status(400).json({
          detail: "Vui lòng chọn đầy đủ thông tin đánh giá !",
        });
      }
      let data = await db.Rate.create({
        ProductId: product_id,
        star: rating,
        comment: comment,
      });
      return res.status(200).json({
        success: true,
        message: "Đánh giá sản phẩm thành công!",
        rate: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = RateController;
