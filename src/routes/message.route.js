import { Router } from "express";
import * as messageController from "../controllers/message.controller.js";

const router = Router();

router.get("/:id", messageController.getMessage);
router.get("/", messageController.getAllMessages);
router.post("/", messageController.createMessage);
router.put("/:id", messageController.updateMessage);

export default router;
