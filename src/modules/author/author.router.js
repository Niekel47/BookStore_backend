const { Router } = require("express");
const router = Router();
const AuthorController = require("./author.controller.js"); 

router.post("/", AuthorController.createAuthor);
router.get("/", AuthorController.getAllAuthor);
router.put("/:id", AuthorController.updateAuthor);
router.delete("/:id", AuthorController.deleteAuthor);
router.post("/delete-many", AuthorController.deleteManyAuthor);

module.exports = router;
