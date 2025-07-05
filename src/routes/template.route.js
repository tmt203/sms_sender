import { Router } from "express";
import * as templateController from "../controllers/template.controller.js";

const router = Router();

router.get("/:id", templateController.getTemplate);
router.get("/", templateController.getAllTemplates);
router.post("/", templateController.handleParams, templateController.createTemplate);
router.put("/:id", templateController.handleParams, templateController.updateTemplate);
router.delete("/:id", templateController.deleteTemplate);
router.delete("/", templateController.deleteTemplates);

export default router;
