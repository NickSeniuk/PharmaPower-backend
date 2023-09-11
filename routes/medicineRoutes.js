import express from "express";
import {
  createMedicineController,
  updateMedicineController,
  deleteMedicineController,
  getMedicineController,
  getMedicinePhotoController,
  getSingleMedicineController,
  medicineFilterController,
  medicineCountController,
  medicineListController,
  searchMedicineController,
  medicineCategoryController,
  brainTreePaymentController,
  braintreeTokenController,
} from "../controllers/medicineController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-medicine",
  //   requireSignIn,
  //   isAdmin,
  formidable(),
  createMedicineController
);
//routes
router.put(
  "/update-medicine/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateMedicineController
);

//delete medicine
router.delete("/delete-medicine/:mid", deleteMedicineController);

//get medicine
router.get("/get-medicine", getMedicineController);

//single medicine
router.get("/get-medicine/:slug", getSingleMedicineController);

//get photo
router.get("/medicine-photo/:mid", getMedicinePhotoController);

//filter medicine
router.post("/medicine-filters", medicineFilterController);

//medicine count
router.get("/medicine-count", medicineCountController);

//medicine per page
router.get("/medicine-list/:page", medicineListController);

//search medicine
router.get("/search/:keyword", searchMedicineController);

//category wise medicine
router.get("/medicine-category/:slug", medicineCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
