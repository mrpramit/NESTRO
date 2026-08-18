"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  addProduct,
  fetchProductById,
  updateProduct,
  fetchCategories,
  fetchRooms
} from "@/utils/api";
import { generateSlug } from "@/utils/helper";
import PageHeader from "@/components/admin/PageHeader";
import { FormInput, FormTextArea, FormSelect, FormCheckbox } from "@/components/admin/FormFields";

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // Options lists
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Form fields state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [roomId, setRoomId] = useState("");
  
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");

  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  
  // Dimensions
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Media
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Handlers for multiple photos
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeNewImage = (idx) => {
    URL.revokeObjectURL(newImagePreviews[idx]);
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Switches / Booleans
  const [stock, setStock] = useState(true);
  const [status, setStatus] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  const [isSlugManual, setIsSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  // Load category and room options on mount
  useEffect(() => {
    const loadOptions = async () => {
      const [catRes, roomRes] = await Promise.all([
        fetchCategories(),
        fetchRooms()
      ]);
      if (catRes.success) setCategories(catRes.data);
      if (roomRes.success) setRooms(roomRes.data);
    };
    loadOptions();
  }, []);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (editId) {
      const loadDetails = async () => {
        const response = await fetchProductById(editId);
        if (response.success && response.data) {
          const prod = response.data;
          setName(prod.name || "");
          setSlug(prod.slug || "");
          setCategoryId(prod.categoryId || "");
          setRoomId(prod.roomId || "");
          setOriginalPrice(prod.originalPrice !== undefined ? String(prod.originalPrice) : "");
          setSalePrice(prod.salePrice !== undefined ? String(prod.salePrice) : "");
          setShortDescription(prod.shortDescription || "");
          setDescription(prod.description || "");
          setMaterial(prod.material || "");
          
          if (prod.dimensions) {
            setWidth(prod.dimensions.width !== undefined ? String(prod.dimensions.width) : "");
            setHeight(prod.dimensions.height !== undefined ? String(prod.dimensions.height) : "");
            setDepth(prod.dimensions.depth !== undefined ? String(prod.dimensions.depth) : "");
          }
          setWeight(prod.weight !== undefined ? String(prod.weight) : "");
          setColor(prod.color || "");
          setSeoTitle(prod.seoTitle || "");
          setSeoDescription(prod.seoDescription || "");
          
          if (prod.thumbnail) {
            setImagePreview(prod.thumbnail);
          }
          if (prod.images) {
            setExistingImages(prod.images);
          }
          
          setStock(prod.stock !== undefined ? prod.stock : true);
          setStatus(prod.status !== undefined ? prod.status : true);
          setFeatured(prod.featured || false);
          setBestSeller(prod.bestSeller || false);
          setNewArrival(prod.newArrival || false);
          
          setIsSlugManual(true);
        } else {
          toast.error(response.message || "Failed to load product details");
        }
        setLoading(false);
      };
      loadDetails();
    }
  }, [editId]);

  // Handle name change and auto-generate slug
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!isSlugManual) {
      setSlug(generateSlug(value));
    }
  };

  // Track manual edits on slug
  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugManual(true);
  };

  // Auto-calculate discount directly
  const orig = parseFloat(originalPrice);
  const sale = parseFloat(salePrice);
  const discount = (!isNaN(orig) && !isNaN(sale) && orig > 0)
    ? Math.max(0, Math.round(((orig - sale) / orig) * 100))
    : 0;

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      toast.error("Product Name is required");
      return;
    }

    if (!trimmedSlug) {
      toast.error("Slug is required");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!roomId) {
      toast.error("Please select a room type");
      return;
    }

    if (!originalPrice || isNaN(parseFloat(originalPrice))) {
      toast.error("Valid Original Price is required");
      return;
    }

    if (!salePrice || isNaN(parseFloat(salePrice))) {
      toast.error("Valid Sale Price is required");
      return;
    }

    if (!editId && !imageFile) {
      toast.error("Please upload a product thumbnail");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", trimmedName);
    formData.append("slug", trimmedSlug);
    formData.append("categoryId", categoryId);
    formData.append("roomId", roomId);
    formData.append("originalPrice", originalPrice);
    formData.append("salePrice", salePrice);
    formData.append("discount", String(discount));
    formData.append("shortDescription", shortDescription.trim());
    formData.append("description", description.trim());
    formData.append("material", material.trim());
    
    // Dimensions
    formData.append("width", width || "0");
    formData.append("height", height || "0");
    formData.append("depth", depth || "0");
    formData.append("weight", weight || "0");
    
    formData.append("color", color.trim());
    formData.append("seoTitle", seoTitle.trim());
    formData.append("seoDescription", seoDescription.trim());
    
    // Switches
    formData.append("stock", String(stock));
    formData.append("status", String(status));
    formData.append("featured", String(featured));
    formData.append("bestSeller", String(bestSeller));
    formData.append("newArrival", String(newArrival));

    if (imageFile) {
      formData.append("image", imageFile); // 'image' is parsed by multer backend
    }
    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    let result;
    if (editId) {
      result = await updateProduct(editId, formData);
    } else {
      result = await addProduct(formData);
    }

    if (result.success) {
      toast.success(result.message || (editId ? "Product updated successfully!" : "Product created successfully!"));
      router.push("/admin/product");
    } else {
      toast.error(result.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
      </div>
    );
  }

  const categoryOptions = categories.map((cat) => ({ value: cat._id, label: cat.name }));
  const roomOptions = rooms.map((room) => ({ value: room._id, label: room.name }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title={editId ? "Edit Product" : "Create Product"}
        description={editId ? "Modify existing furniture details and stock parameters" : "Publish a new piece of furniture to the catalog"}
        backHref="/admin/product"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Main Info Columns */}
          <div className="md:col-span-2 space-y-6">
            
            {/* General Information Card */}
            <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] p-6.5 space-y-5">
              <h3 className="text-lg font-bold text-black dark:text-white border-b border-[#e2e8f0] pb-2 dark:border-[#2e3a47]">
                General Information
              </h3>

              {/* Product Name */}
              <FormInput
                label="Product Name"
                required
                placeholder="e.g., Luxury Velvet Chesterfield Sofa"
                value={name}
                onChange={handleNameChange}
              />

              {/* Slug */}
              <FormInput
                label="Slug"
                required
                placeholder="e.g., luxury-velvet-chesterfield-sofa"
                value={slug}
                onChange={handleSlugChange}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Category Selection */}
                <FormSelect
                  label="Category"
                  required
                  placeholder="Select Category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  options={categoryOptions}
                />

                {/* Room Type Selection */}
                <FormSelect
                  label="Room Type"
                  required
                  placeholder="Select Room Type"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  options={roomOptions}
                />
              </div>

              {/* Short Description */}
              <FormInput
                label="Short Description"
                placeholder="Summarize product features in 1 sentence..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />

              {/* Description */}
              <FormTextArea
                label="Detailed Description"
                placeholder="Provide comprehensive details about construction, luxury status, design, styling tip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Dimensions and Logistics Card */}
            <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] p-6.5 space-y-5">
              <h3 className="text-lg font-bold text-black dark:text-white border-b border-[#e2e8f0] pb-2 dark:border-[#2e3a47]">
                Logistics & Dimensions
              </h3>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* Width */}
                <FormInput
                  label="Width (cm)"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />

                {/* Height */}
                <FormInput
                  label="Height (cm)"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />

                {/* Depth */}
                <FormInput
                  label="Depth (cm)"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Depth"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                />

                {/* Weight */}
                <FormInput
                  label="Weight (kg)"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Material */}
                <FormInput
                  label="Material"
                  placeholder="e.g., Solid Walnut Wood, Bouclé"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                />

                {/* Color */}
                <FormInput
                  label="Color"
                  placeholder="e.g., Emerald Green, Sand"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            {/* SEO Optimization Card */}
            <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] p-6.5 space-y-5">
              <h3 className="text-lg font-bold text-black dark:text-white border-b border-[#e2e8f0] pb-2 dark:border-[#2e3a47]">
                SEO Optimization
              </h3>

              {/* SEO Title */}
              <FormInput
                label="SEO Title"
                placeholder="Meta title for search engine optimization..."
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />

              {/* SEO Description */}
              <FormTextArea
                label="SEO Description"
                rows={3}
                placeholder="Meta description for search listing preview..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>

          </div>

          {/* Right Column / Sidebar Info */}
          <div className="space-y-6">
            
            {/* Pricing Card */}
            <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] p-6.5 space-y-5">
              <h3 className="text-lg font-bold text-black dark:text-white border-b border-[#e2e8f0] pb-2 dark:border-[#2e3a47]">
                Pricing & Discounts
              </h3>

              {/* Original Price */}
              <FormInput
                label="Original Price (₹)"
                required
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 39999.00"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />

              {/* Sale Price */}
              <FormInput
                label="Sale Price (₹)"
                required
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 29999.00"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />

              {/* Discount Display */}
              <div className="bg-[#f8fafc] dark:bg-[#24303f] border border-[#e2e8f0] dark:border-[#2e3a47] p-4 rounded-sm flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Computed Discount</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-300">Auto-calculated based on prices</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {discount}%
                  </span>
                  <span className="block text-xs font-semibold text-emerald-500">OFF</span>
                </div>
              </div>
            </div>

            {/* Media Upload Card */}
            <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] p-6.5 space-y-5">
              <h3 className="text-lg font-bold text-black dark:text-white border-b border-[#e2e8f0] pb-2 dark:border-[#2e3a47]">
                Product Media
              </h3>

              {/* Thumbnail */}
              <div className="border-b border-[#e2e8f0] pb-4 dark:border-[#2e3a47]">
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Thumbnail Image {!editId && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editId}
                  onChange={handleImageChange}
                  className="w-full rounded-sm border border-[#e2e8f0] bg-transparent py-3 px-4 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors"
                />
                
                {imagePreview && (
                  <div className="mt-4 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-400">Thumbnail Preview:</span>
                    <div className="relative h-40 w-full rounded border border-[#e2e8f0] dark:border-[#2e3a47] overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Photos */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                  Additional Product Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImagesChange}
                  className="w-full rounded-sm border border-[#e2e8f0] bg-transparent py-3 px-4 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors"
                />

                {/* Existing Images Previews */}
                {existingImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">Existing Photos:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative h-24 border border-[#e2e8f0] dark:border-[#2e3a47] rounded overflow-hidden group">
                          <img src={img} alt="Existing Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-rose-600 text-white text-xs hover:bg-rose-700 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Previews */}
                {newImagePreviews.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">New Photos to Upload:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {newImagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative h-24 border border-[#e2e8f0] dark:border-[#2e3a47] rounded overflow-hidden group">
                          <img src={preview} alt="New Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-rose-600 text-white text-xs hover:bg-rose-700 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Publishing Settings / Toggles */}
            <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] p-6.5 space-y-5">
              <h3 className="text-lg font-bold text-black dark:text-white border-b border-[#e2e8f0] pb-2 dark:border-[#2e3a47]">
                Settings & Visibility
              </h3>

              <div className="space-y-4">
                {/* Stock Switch */}
                <FormCheckbox
                  label="In Stock"
                  description="Is product currently available"
                  checked={stock}
                  onChange={(e) => setStock(e.target.checked)}
                />

                {/* Status Switch */}
                <FormCheckbox
                  label="Active"
                  description="Show in public listings"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />

                <hr className="border-[#e2e8f0] dark:border-[#2e3a47]" />

                {/* Featured Switch */}
                <FormCheckbox
                  label="Featured Product"
                  description="Pin to home/featured sections"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />

                {/* BestSeller Switch */}
                <FormCheckbox
                  label="Best Seller"
                  description="Display bestseller badge"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                />

                {/* New Arrival Switch */}
                <FormCheckbox
                  label="New Arrival"
                  description="Display new arrival tag"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e2e8f0] dark:border-[#2e3a47]">
          <Link
            href="/admin/product"
            className="rounded-sm border border-[#e2e8f0] px-8 py-3.5 text-center font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:text-white dark:hover:bg-[#24303f] transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex justify-center rounded-sm bg-black px-8 py-3.5 font-medium text-white hover:bg-opacity-95 dark:bg-white dark:text-black dark:hover:bg-opacity-95 disabled:bg-slate-400 dark:disabled:bg-slate-700 transition-all cursor-pointer shadow-sm"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white dark:border-black border-t-transparent"></span>
                Saving...
              </span>
            ) : editId ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
      </div>
    }>
      <AddProductForm />
    </Suspense>
  );
}
