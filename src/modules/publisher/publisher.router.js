const { Router } = require("express");
const router = Router();
const PublisherController = require("./publisher.controller.js"); ;

router.post("/", PublisherController.createPublisher);
router.get("/", PublisherController.getAllPublisher);
router.put("/:id", PublisherController.updatePublisher);
router.delete("/:id", PublisherController.deletePublisher);
router.post("/delete-many", PublisherController.deleteManyPublisher);

module.exports = router;
