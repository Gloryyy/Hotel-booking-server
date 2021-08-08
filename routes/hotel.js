import express from "express";
import formidable from "express-formidable";
import { requireSignin } from "../middlewares";
const router = express.Router();

import { create } from "../controllers/hotel";

router.post("/create-hotel", requireSignin, formidable(), create);

module.exports = router;
