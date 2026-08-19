import { client } from "./helper";

export const fetchRooms = async () => {
    try {
        const response = await client.get("room-type");

        return {
            success: response.data.success,
            data: response.data.data || [],
            message: response.data.message
        };

    } catch (error) {
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchRoomsById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`);

        return {
            success: response.data.success,
            data: response.data.data || null,
            message: response.data.message
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const addRoomType = async (roomData) => {
    try {
        const response = await client.post("room-type/create", roomData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteRoomType = async (id) => {
    try {
        const response = await client.delete(`room-type/delete/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const toggleRoomTypeStatus = async (id) => {
    try {
        const response = await client.put(`room-type/status-update/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchCategories = async () => {
    try {
        const response = await client.get("category");
        return {
            success: response.data.success,
            data: response.data.data || [],
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await client.post("category/create", categoryData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await client.delete(`category/delete/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

// User / Profile API aliases (use existing user-specific functions below)
export const fetchProfile = (...args) => fetchUserProfile(...args);
export const updateProfile = (payload) => updateUserProfile(payload);
export const addAddressApi = (payload) => addUserAddress(payload);
export const deleteAddressApi = (addressId) => deleteUserAddress(addressId);
export const setDefaultAddressApi = (addressId) => setUserDefaultAddress(addressId);
export const deleteAccountApi = () => deleteUserAccount();

export const toggleCategoryStatus = async (id) => {
    try {
        const response = await client.put(`category/status-update/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const updateRoomType = async (id, roomData) => {
    try {
        const response = await client.put(`room-type/update/${id}`, roomData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchCategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`);
        return {
            success: response.data.success,
            data: response.data.data || null,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await client.put(`category/update/${id}`, categoryData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchProducts = async (params = {}) => {
    try {
        const response = await client.get("product", { params });
        return {
            success: response.data.success,
            data: response.data.products || [],
            meta: response.data.meta || null,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            meta: null,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};
                // Removed extra closing brace
export const fetchProductById = async (id) => {
    try {
        const response = await client.get(`product/${id}`);
        return {
            success: response.data.success,
            data: response.data.product || null,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await client.post("product/create", productData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await client.put(`product/update/${id}`, productData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await client.delete(`product/delete/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const toggleProductStatus = async (id) => {
    try {
        const response = await client.patch(`product/status-update/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const toggleProductField = async (id, flag) => {
    try {
        const response = await client.patch(`product/status/${id}`, { flag });
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await client.post("user/register", userData);
        return {
            success: response.data.success,
            user: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const verifyUserOtp = async (otpData) => {
    try {
        const response = await client.post("user/verify-otp", otpData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const resendUserOtp = async (otpData) => {
    try {
        const response = await client.post("user/resend-otp", otpData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await client.post("user/login", loginData);
        return {
            success: response.data.success,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchUserProfile = async (token = null) => {
    try {
        const config = token ? { headers: { Authorization: token } } : {};
        const response = await client.get("user/profile", config);
        return {
            success: response.data.success,
            user: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await client.put("user/profile/update", profileData);
        return {
            success: response.data.success,
            user: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const addUserAddress = async (addressData) => {
    try {
        const response = await client.post("user/address/add", addressData);
        return {
            success: response.data.success,
            user: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteUserAddress = async (addressId) => {
    try {
        const response = await client.delete(`user/address/delete/${addressId}`);
        return {
            success: response.data.success,
            user: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const setUserDefaultAddress = async (addressId) => {
    try {
        const response = await client.patch(`user/address/default/${addressId}`);
        return {
            success: response.data.success,
            user: response.data.user,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteUserAccount = async () => {
    try {
        const response = await client.delete("user/profile/delete");
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const sendOrderEmail = async (orderPayload) => {
    try {
        const response = await client.post("user/send-order-email", orderPayload);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};
