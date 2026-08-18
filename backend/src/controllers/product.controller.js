import ProductModel from "../models/product.models.js";
import CategoryModel from "../models/category.models.js";
import { sendBadRequest, sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";
import RoomModel from "../models/room.models.js";

const get = async (req, res) => {
    try {

        const query = req.query;

        const filter = {};
        const sortBy = {};
        const limit = query.limit
            ? parseInt(query.limit)
            : 20;

        const skip = query.skip
            ? parseInt(query.skip)
            : 0;

        // Boolean Filters
        if (query.stock)
            filter.stock = query.stock === "true";

        if (query.bestSeller)
            filter.bestSeller = query.bestSeller === "true";

        if (query.newArrival)
            filter.newArrival = query.newArrival === "true";

        if (query.featured)
            filter.featured = query.featured === "true";

        // Slug Filter
        if (query.slug)
            filter.slug = query.slug;

        // Room Filter
        if (query.room) {

            const roomSlugs = query.room.split(",");

            const rooms = await RoomModel.find({
                slug: { $in: roomSlugs }
            }).select("_id");



            const roomIds = rooms.map(
                room => room._id
            );

            filter.roomId = {
                $in: roomIds
            };
        }
        // Room Filter
        if (query.category) {

            const categorySlugs = query.category.split(",");

            const categories = await CategoryModel.find({
                slug: { $in: categorySlugs }
            }).select("_id");

            const cateogyryIds = categories.map(
                room => room._id
            );

            filter.categoryId = {
                $in: cateogyryIds
            };
        }

        if (query.min && query.max) {
            const min = Number(query.min);
            const max = Number(query.max);
            filter.salePrice = {
                $gte: min,
                $lte: max,
            }
        }

        if (query.sort) {
            if (query.sort == "asc") {
                sortBy.salePrice = 1
            } else if (query.sort = "desc") {
                sortBy.salePrice = -1

            } else {
                sortBy.createdAt = 1
            }
        }


        const products = await ProductModel
            .find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortBy)
            .populate([
                {
                    path: "roomId",
                    select: "_id name slug"
                },
                {
                    path: "categoryId",
                    select: "_id name slug"
                }
            ]);

        const total = await ProductModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Data found",
            products,
            meta: {
                limit,
                total,
                skip,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {

        console.log(error);

        sendServerError(
            res,
            "Internal Server Error"
        );
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Data find",
            product
        })

    } catch (error) {
        sendServerError(res, "Internal Server Error")
    }

}



const create = async (req, res) => {
    try {

        const { roomId,
            categoryId,

            name,
            slug,

            originalPrice,
            salePrice,
            discount,

            shortDescription,
            description,

            material,

            width,
            height,
            depth,

            weight,

            color,

            seoTitle,
            seoDescription
        } = req.body;



        // Image URL
        const thumbnail = req.files && req.files["image"] ? req.files["image"][0].path : "";
        const images = req.files && req.files["images"] ? req.files["images"].map(f => f.path) : [];

        // Check Product Exists
        const product = await ProductModel.findOne({
            $or: [
                { slug },
                { name }
            ]
        });

        if (product) {
            return sendConflict(
                res,
                "Product already exists"
            );
        }

        await ProductModel.create({
            roomId,
            categoryId,

            name,
            slug,

            originalPrice,
            salePrice,
            discount,

            shortDescription,
            description,

            material,

            dimensions: {
                width,
                height,
                depth
            },

            weight,

            color,

            seoTitle,
            seoDescription,
            thumbnail,
            images
        });

        sendCreated(
            res,
            "Product created successfully"
        );

    }
    catch (error) {

        console.log(error);

        sendServerError(
            res,
            "Internal Server Error"
        );
    }
};
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            roomId,
            categoryId,
            name,
            slug,
            originalPrice,
            salePrice,
            discount,
            shortDescription,
            description,
            material,
            width,
            height,
            depth,
            weight,
            color,
            seoTitle,
            seoDescription,
            stock,
            status,
            featured,
            bestSeller,
            newArrival
        } = req.body;

        const product = await ProductModel.findById(id);
        if (!product) {
            return sendNotFound(res, "Product not found");
        }

        // Check for duplicate name or slug excluding this product
        if (name && name !== product.name) {
            const nameExists = await ProductModel.findOne({ name, _id: { $ne: id } });
            if (nameExists) return sendConflict(res, "Product with this name already exists");
        }
        if (slug && slug !== product.slug) {
            const slugExists = await ProductModel.findOne({ slug, _id: { $ne: id } });
            if (slugExists) return sendConflict(res, "Product with this slug already exists");
        }

        const updateData = {
            roomId: roomId || product.roomId,
            categoryId: categoryId || product.categoryId,
            name: name || product.name,
            slug: slug || product.slug,
            originalPrice: originalPrice !== undefined ? Number(originalPrice) : product.originalPrice,
            salePrice: salePrice !== undefined ? Number(salePrice) : product.salePrice,
            discount: discount !== undefined ? Number(discount) : product.discount,
            shortDescription: shortDescription !== undefined ? shortDescription : product.shortDescription,
            description: description !== undefined ? description : product.description,
            material: material !== undefined ? material : product.material,
            dimensions: {
                width: width !== undefined ? Number(width) : product.dimensions?.width,
                height: height !== undefined ? Number(height) : product.dimensions?.height,
                depth: depth !== undefined ? Number(depth) : product.dimensions?.depth,
            },
            weight: weight !== undefined ? Number(weight) : product.weight,
            color: color !== undefined ? color : product.color,
            seoTitle: seoTitle !== undefined ? seoTitle : product.seoTitle,
            seoDescription: seoDescription !== undefined ? seoDescription : product.seoDescription,
            stock: stock !== undefined ? String(stock) === "true" : product.stock,
            status: status !== undefined ? String(status) === "true" : product.status,
            featured: featured !== undefined ? String(featured) === "true" : product.featured,
            bestSeller: bestSeller !== undefined ? String(bestSeller) === "true" : product.bestSeller,
            newArrival: newArrival !== undefined ? String(newArrival) === "true" : product.newArrival,
        };

        let existingImagesArray = product.images || [];
        if (req.body.existingImages) {
            try {
                existingImagesArray = typeof req.body.existingImages === "string"
                    ? JSON.parse(req.body.existingImages)
                    : req.body.existingImages;
            } catch (e) {
                existingImagesArray = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
            }
        }

        if (req.files) {
            if (req.files["image"]) {
                updateData.thumbnail = req.files["image"][0].path;
            }
            if (req.files["images"]) {
                const newImages = req.files["images"].map(f => f.path);
                updateData.images = [...existingImagesArray, ...newImages];
            } else {
                updateData.images = existingImagesArray;
            }
        } else {
            updateData.images = existingImagesArray;
        }

        await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        return sendSuccess(res, "Product updated successfully");
    } catch (error) {
        console.log(error);
        return sendServerError(res, "Internal Server Error");
    }
};

const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) return sendNotFound(res, "Product not found");
        await ProductModel.findByIdAndDelete(id);

        sendSuccess(res, "Product deleted successfully");
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const StatusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) return sendNotFound(res, "Product not found");
        await ProductModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: !product.status
                }
            }
        );

        sendSuccess(res, "Product status updated successfully");
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};


const StatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const { flag } = req.body;
        const product = await ProductModel.findById({ _id: id });
        if (!product) return sendNotFound(res);


        await ProductModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    [flag]: !product[flag]
                }
            }
        )

        sendSuccess(res, "Status Update Sucessfully")

    } catch (error) {
        console.log(error)
        sendServerError(res, "Internal Server Error")
    }

}


const addImages = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product) {
            return sendNotFound(res);
        }

        if (!req.files || req.files.length === 0) {
            return sendError(res, "Please upload images");
        }

        const images = req.files.map(file => file.url);

        // Add new images to existing images
        product.images.push(...images);

        await product.save();

        return sendSuccess(res, "Images added successfully");

    } catch (error) {
        console.log(error);
        return sendServerError(res, "Internal Server Error");
    }
};



export {
    get,
    create,
    StatusUpdate,
    deleteById,
    getById,
    update,
    StatusById,
    addImages
}