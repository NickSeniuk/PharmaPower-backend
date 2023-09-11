import medicineModel from "../models/MedicineModel.js";
import categoryModel from "../models/CategoryModel.js";
import orderModel from "../models/OrderModel.js";

import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import braintree from "braintree";
dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT,
  publicKey: process.env.BRAINTREE_PUBLIC,
  privateKey: process.env.BRAINTREE_PRIVATE,
});

export const createMedicineController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less then 1mb" });
    }

    const medicine = new medicineModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      medicine.photo.data = fs.readFileSync(photo.path);
      medicine.photo.contentType = photo.type;
    }
    await medicine.save();
    res.status(201).send({
      success: true,
      message: "Medicine Created Successfully",
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing medicine",
    });
  }
};

//get all medicine
export const getMedicineController = async (req, res) => {
  try {
    const medicine = await medicineModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: medicine.length,
      message: "All medicine ",
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting medicine",
      error: error.message,
    });
  }
};
// get single medicine
export const getSingleMedicineController = async (req, res) => {
  try {
    const medicine = await medicineModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Medicine Fetched",
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single medicine",
      error,
    });
  }
};

// get photo
export const getMedicinePhotoController = async (req, res) => {
  try {
    const medicine = await medicineModel
      .findById(req.params.mid)
      .select("photo");
    if (medicine.photo.data) {
      res.set("Content-type", medicine.photo.contentType);
      return res.status(200).send(medicine.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteMedicineController = async (req, res) => {
  try {
    await medicineModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Medicine Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting medicine",
      error,
    });
  }
};

//update medicine
export const updateMedicineController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const medicine = await medicineModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      medicine.photo.data = fs.readFileSync(photo.path);
      medicine.photo.contentType = photo.type;
    }
    await medicine.save();
    res.status(201).send({
      success: true,
      message: "Medicine Updated Successfully",
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating medicine",
    });
  }
};

//filters
export const medicineFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const medicine = await medicineModel.find(args);
    res.status(200).send({
      success: true,
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering medicine",
      error,
    });
  }
};

export const medicineCountController = async (req, res) => {
  try {
    const total = await medicineModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in medicine count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const medicineListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const medicine = await medicineModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//searching medicine
export const searchMedicineController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await medicineModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search medicine API",
      error,
    });
  }
};

// get medicine by category
export const medicineCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const medicine = await medicineModel
      .find({ category })
      .populate("category");
    res.status(200).send({
      success: true,
      category,
      medicine,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting medicine",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            medicine: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
