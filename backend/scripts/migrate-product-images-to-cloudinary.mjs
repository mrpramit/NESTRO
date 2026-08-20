import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../src/models/product.models.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const isCloudinaryUrl = (value) =>
  typeof value === "string" && value.includes("res.cloudinary.com/");

const cloudinarySlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const uploadProductImage = async (product, source, label) => {
  if (!source || isCloudinaryUrl(source)) return source;

  try {
    const result = await cloudinary.uploader.upload(source, {
      folder: `nestro/products/${cloudinarySlug(product.slug)}`,
      public_id: label,
      resource_type: "image",
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
    });

    return result.secure_url;
  } catch (error) {
    console.warn(`Skipped ${product.slug}/${label}: ${error.message}`);
    return source;
  }
};

await mongoose.connect(process.env.MONGODB_URL);
console.log("Connected to MongoDB");

const products = await ProductModel.find().select("_id slug thumbnail images");
let updatedProducts = 0;
let uploadedImages = 0;

for (const product of products) {
  let changed = false;
  let thumbnail = product.thumbnail;

  if (thumbnail && !isCloudinaryUrl(thumbnail)) {
    const migratedThumbnail = await uploadProductImage(product, thumbnail, "thumbnail");
    if (migratedThumbnail !== thumbnail) {
      thumbnail = migratedThumbnail;
      uploadedImages += 1;
      changed = true;
    }
  }

  const images = await Promise.all(
    (product.images || []).map(async (image, index) => {
      if (!image || isCloudinaryUrl(image)) return image;
      const migratedImage = await uploadProductImage(product, image, `image-${index + 1}`);
      if (migratedImage !== image) {
        uploadedImages += 1;
        changed = true;
      }
      return migratedImage;
    }),
  );

  if (changed) {
    await ProductModel.updateOne(
      { _id: product._id },
      { $set: { thumbnail, images } },
    );
    updatedProducts += 1;
    console.log(`Migrated ${product.slug}`);
  }
}

await mongoose.disconnect();
console.log(`Migrated ${updatedProducts} products and uploaded ${uploadedImages} images.`);
