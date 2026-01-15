const router = require("express").Router();
const controller = require("../controllers/comment.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", controller.getComments);
router.get("/:id/replies", controller.getReplies);
router.post("/", auth, controller.createComment);
router.put("/:id", auth, controller.editComment);
router.post("/:id/like", auth, controller.likeComment);
router.post("/:id/dislike", auth, controller.dislikeComment);
router.delete("/:id", auth, controller.deleteComment);

module.exports = router;
