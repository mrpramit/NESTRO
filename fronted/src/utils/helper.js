import axios from "axios";

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 5000,
    withCredentials: true
});

const generateSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")

}

export {client, generateSlug}