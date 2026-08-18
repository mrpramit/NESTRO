"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { addCategory, fetchCategoryById, updateCategory } from "@/utils/api";
import { generateSlug } from "@/utils/helper";
import PageHeader from "@/components/admin/PageHeader";
import { FormInput } from "@/components/admin/FormFields";

function AddCategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch category data if in edit mode
  useEffect(() => {
    if (editId) {
      const loadDetails = async () => {
        setLoading(true);
        const response = await fetchCategoryById(editId);
        if (response.success && response.data) {
          setName(response.data.name);
          setSlug(response.data.slug);
          if (response.data.image) {
            setImagePreview(response.data.image);
          }
          setIsSlugManual(true);
        } else {
          toast.error(response.message || "Failed to load category details");
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

    if (!trimmedName || trimmedName.length < 3) {
      toast.error("Category Name must be at least 3 characters long");
      return;
    }

    if (!trimmedSlug || trimmedSlug.length < 3) {
      toast.error("Category Slug must be at least 3 characters long");
      return;
    }

    if (!editId && !imageFile) {
      toast.error("Please upload a category image");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", trimmedName);
    formData.append("slug", trimmedSlug);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    let result;
    if (editId) {
      result = await updateCategory(editId, formData);
    } else {
      result = await addCategory(formData);
    }

    if (result.success) {
      toast.success(result.message || (editId ? "Category updated successfully!" : "Category created successfully!"));
      router.push("/admin/category");
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <PageHeader
        title={editId ? "Edit Category" : "Create Category"}
        description={editId ? "Modify ecommerce category details and parameters" : "Add a new ecommerce category option"}
        backHref="/admin/category"
      />

      {/* Form Card */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
        <div className="border-b border-[#e2e8f0] px-6.5 py-4 dark:border-[#2e3a47]">
          <h3 className="font-semibold text-black dark:text-white">
            {editId ? "Edit Category Details" : "Category Details"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6.5 space-y-6">
          {/* Category Name Input */}
          <FormInput
            label="Category Name"
            required
            placeholder="e.g., Electronics, Fashion"
            value={name}
            onChange={handleNameChange}
          />

          {/* Slug Input */}
          <FormInput
            label="Slug"
            required
            placeholder="e.g., electronics"
            value={slug}
            onChange={handleSlugChange}
            helperText="The URL-friendly slug will auto-generate from the name, but can be customized manually."
          />

          {/* Category Image Input */}
          <div>
            <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">
              Category Image {!editId && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editId}
              onChange={handleImageChange}
              className="w-full rounded-sm border border-[#e2e8f0] bg-transparent py-3 px-5 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors"
            />
            {imagePreview && (
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400">Current Image Preview:</span>
                <div className="relative h-24 w-24 rounded border border-[#e2e8f0] dark:border-[#2e3a47] overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <img
                    src={imagePreview}
                    alt="Category Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e2e8f0] dark:border-[#2e3a47]">
            <Link
              href="/admin/category"
              className="rounded-sm border border-[#e2e8f0] px-6 py-3 text-center font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:text-white dark:hover:bg-[#24303f] transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex justify-center rounded-sm bg-black px-6 py-3 font-medium text-white hover:bg-opacity-95 dark:bg-white dark:text-black dark:hover:bg-opacity-95 disabled:bg-slate-400 dark:disabled:bg-slate-700 transition-all cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white dark:border-black border-t-transparent"></span>
                  Saving...
                </span>
              ) : editId ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddCategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3c50e0] border-t-transparent dark:border-blue-500"></div>
      </div>
    }>
      <AddCategoryForm />
    </Suspense>
  );
}
