const bcrypt = require("bcrypt");
const db = require("../../models/index");

class UserService {
  static async getAllUsers(req, res) {
    try {
      const { page, limit = 3, sort, search } = req.query;
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
      const totalUsers = await db.User.count(options.where);
      const totalPages = Math.ceil(totalUsers / limit);
      // Thực hiện truy vấn để lấy danh sách người dùng với các tùy chọn đã được đặt
      const users = await db.User.findAll(options);
      return {
        totalUsers,
        totalPages,
        users,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateUser(id, req, res) {
    try {
      const { fullname, email, password, phone, address } = req.body;
      const existingUser = await db.User.findByPk(id);
      if (!existingUser) {
        return res.status(404).json({
          error: "Người dùng không tồn tại.",
        });
      }

      // Kiểm tra xem người dùng có cố gắng cập nhật email không
      if (email && email !== existingUser.email) {
        return res.status(400).json({
          error: "Không được phép cập nhật email.",
        });
      }

      if (password && password.length < 6) {
        return res.status(400).json({
          error: "Mật khẩu phải có ít nhất 6 ký tự.",
        });
      }

      if (phone.length < 10 || phone.length > 11) {
        return res.status(400).json({
          error: "Số điện thoại phải có từ 10 đến 11 ký tự.",
        });
      }

      if (password) {
        // Nếu có mật khẩu mới, hash lại mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);
        const put = await db.User.update(
          {
            fullname,
            password: hashedPassword, // Sử dụng mật khẩu mới đã được hash
            phone,
            address,
          },
          { where: { id } }
        );

        return put;
      } else {
        // Nếu không có mật khẩu mới, chỉ cập nhật username và email
        const put = await db.User.update(
          {
            fullname,
            phone,
            address,
          },
          { where: { id } }
        );

        return put;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteUser(id, req, res) {
    try {
      const existingUser = await db.User.findByPk(id);
      if (!existingUser) {
        return res.status(404).json({
          error: "Người dùng không tồn tại.",
        });
      }
      const destroy = await db.User.destroy({ where: { id } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteManyUsers(ids) {
    try {
      const destroy = await db.User.destroy({ where: { id: ids } });
      return destroy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = UserService;
