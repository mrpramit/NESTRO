import CategoryModel from "../models/category.models.js";
import { sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";

const get = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        return res.status(200).json({
            success: true,
            message: "Data find",
            data: categories
        });
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const create = async (req, res) => {
    try {
        const { name, slug } = req.body;

        // Cloudinary Image URL
        const image = req.file ? req.file.path : null;
        console.log(image, "IMAGE")
        const category = await CategoryModel.findOne({ name });
        if (category) return sendConflict(res);
        await CategoryModel.create({ name, slug, image });
        sendCreated(res);

    } catch (error) {
        console.log(error, "error")
        sendServerError(res, "Internal Server Error")
    }
}

const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById({ _id: id });
        if (!category) return sendNotFound(res);

        await CategoryModel.findByIdAndDelete(id);
        sendSuccess(res, "Delete Successfully");
        
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const statusUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById({ _id: id });
        if (!category) return sendNotFound(res);

        await CategoryModel.findByIdAndUpdate(
            { _id: id },
            { $set: {
                status: !category.status
            }}
        );
        sendSuccess(res, "Status update successfully");
        
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id);
        if (!category) return sendNotFound(res);
        return res.status(200).json({
            success: true,
            message: "Data find",
            data: category
        });
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        
        const category = await CategoryModel.findOne({ name, _id: { $ne: id } });
        if (category) return sendConflict(res, "Category with this name already exists");

        const category_slug = await CategoryModel.findOne({ slug, _id: { $ne: id } });
        if (category_slug) return sendConflict(res, "Category with this slug already exists");

        const updateData = { name, slug };
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updated = await CategoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updated) return sendNotFound(res);

        sendSuccess(res, "Update Successfully");

    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

export {
    get, 
    create,
    deleteById,
    statusUpdate,
    getById,
    updateById
};