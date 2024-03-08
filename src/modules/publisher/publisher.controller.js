const PublisherService = require("./publisher.service.js"); ;

class PublisherController {
  static createPublisher = async (req, res) => {
    try {
      const { name } = req.body;
      const create_Publisher = await PublisherService.createPublisher(req.body);
      return res.status(200).json(create_Publisher);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  static async getAllPublisher(req, res) {
    try {
      const allPublisher = await PublisherService.getAllPublisher(req, res);
      res.status(200).json(allPublisher);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updatePublisher(req, res) {
    try {
      const { id } = req.params;
      const updateCat = await PublisherService.updatePublisher(id, req, res);
      res.status(200).json(updateCat);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deletePublisher(req, res) {
    try {
      const { id } = req.params;
      await PublisherService.deletePublisher(id, req, res);
      res.status(200).json({ message: "Publisher đã được xóa thành công." });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyPublisher(req, res) {
    try {
      const { ids } = req.body; // Lấy danh sách các id cần xóa từ request body
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          error: "Danh sách id không hợp lệ.",
        });
      }
      const destroyCount = await PublisherService.deleteManyPublishers(ids);

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

module.exports = PublisherController;
