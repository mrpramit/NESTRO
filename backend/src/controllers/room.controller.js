import RoomModel from "../models/room.models.js";
import {sendConflict, sendCreated, sendNotFound, sendServerError, sendSuccess } from "../utils/response.js";

const get = async (req, res) => {
    try {
        const rooms = await RoomModel.find();
        return res.status(200).json({
            success: true,
            message: "Data find",
            data: rooms
        })
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const create = async (req, res) => {
    try {
        const {name, slug} = req.body;
        const room_type = await RoomModel.findOne({name });
        if(room_type) return sendConflict(res);

        await RoomModel.create({name, slug});
        sendCreated(res);

    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const deleteById = async (req, res) => {
    try {
        const {id} = req.params
        const room_type = await RoomModel.findById({_id: id});
        if(!room_type) return sendNotFound(res);

        await RoomModel.findByIdAndDelete(id);
        sendSuccess(res, "Delete Successfully")
        
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const statusUpdate = async (req, res) => {
    try {
        const {id} = req.params
        const room_type = await RoomModel.findById({_id: id});
        if(!room_type) return sendNotFound(res);

        await RoomModel.findByIdAndUpdate(
            {_id: id},
            {$set: {
                status: !room_type.status
            }}
        );
        sendSuccess(res, "Status update successfully")
        
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await RoomModel.findById(id);
        if (!room) return sendNotFound(res);
        return res.status(200).json({
            success: true,
            message: "Data find",
            data: room
        });
    } catch (error) {
        sendServerError(res, "Internal Server Error");
    }
};

const updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        
        const room_type = await RoomModel.findOne({ name, _id: { $ne: id } });
        if (room_type) return sendConflict(res, "Room Type with this name already exists");

        const room_slug = await RoomModel.findOne({ slug, _id: { $ne: id } });
        if (room_slug) return sendConflict(res, "Room Type with this slug already exists");

        const updated = await RoomModel.findByIdAndUpdate(
            id,
            { name, slug },
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
}