import { Router } from "express";
import * as brandController from "../controllers/brand.controller.js";

const router = Router();

router.get("/:id", brandController.getBrand);
router.get("/", brandController.getAllBrands);
router.post("/", brandController.createBrand);
router.put("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);
router.delete("/", brandController.deleteBrands);

export default router;
