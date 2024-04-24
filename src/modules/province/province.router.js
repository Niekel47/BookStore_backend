const express = require("express");
const router = express.Router();
const Client = require("node-rest-client").Client;

const client = new Client();

router.get("/", function (req, res) {
  const url = "https://vapi.vnappmob.com/api/province";
  client.get(url, function (data, response) {
    res.send(data); // Gửi dữ liệu nhận được từ API trở lại client
  });
});

router.get("/district/:province_id", function (req, res) {
  const province_id = req.params.province_id;
  const url = "https://vapi.vnappmob.com/api/province/district/";
  client.get(url + province_id, function (data, response) {
    res.send(data); // Gửi dữ liệu nhận được từ API trở lại client
  });
});

router.get("/ward/:district_id", function (req, res) {
  const district_id = req.params.district_id;
  //   console.log("district_id", district_id);
  const url = "https://vapi.vnappmob.com/api/province/ward/";
  client.get(url + district_id, function (data, response) {
    res.send(data); // Gửi dữ liệu nhận được từ API trở lại client
  });
});

module.exports = router;
