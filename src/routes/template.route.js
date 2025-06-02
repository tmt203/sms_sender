import { Router } from "express";
import * as templateController from "../controllers/template.controller.js";

const router = Router();

router.get("/:id", templateController.getTemplate);
router.get("/", templateController.getAllTemplates);
router.post("/", templateController.createTemplate);
router.put("/:id", templateController.updateTemplate);

export default router;
