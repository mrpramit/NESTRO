"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { fetchCategories, deleteCategory, toggleCategoryStatus } from "@/utils/api";
import { CategoryIcon } from "@/components/admin/Icons";
import PageHeader from "@/components/admin/PageHeader";
import SearchAndFilter from "@/components/admin/SearchAndFilter";
import AdminTable from "@/components/admin/AdminTable";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Load categories from API
  const loadCategories = async () => {
    const response = await fetchCategories();
    if (response.success) {
      setCategories(response.data);
    } else {
      toast.error(response.message || "Failed to fetch categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      loadCategories();
    }, 0);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    setActiveDropdown(null);
    const response = await toggleCategoryStatus(id);
    if (response.success) {
      toast.success(response.message || "Status updated successfully");
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === id ? { ...cat, status: !currentStatus } : cat
        )
      );
    } else {
      toast.error(response.message || "Failed to update status");
    }
  };

  // Handle deletion
  const handleDelete = async (id, name) => {
    setActiveDropdown(null);
    const isDark = document.documentElement.classList.contains("dark");
    const result = await Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3c50e0",
      cancelButtonColor: "#f23c3c",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1c2434" : "#ffffff",
      color: isDark ? "#dee4ee" : "#1e293b",
    });

    if (result.isConfirmed) {
      const response = await deleteCategory(id);
      if (response.success) {
        toast.success(response.message || "Deleted successfully");
        loadCategories();
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    }
  };

  // Filter logic
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? cat.status === true
        : cat.status === false;

    return matchesSearch && matchesStatus;
  });

  const tableHeaders = [
    { label: "ID", className: "w-20" },
    { label: "Category" },
    { label: "Slug" },
    { label: "Status", className: "w-40" },
    { label: "Action", className: "text-right w-32" }
  ];

  const searchFilters = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Category List"
        description="Manage your ecommerce categories"
        actionText="Create Category"
        actionHref="/admin/category/add"
      />

      {/* Filter and Search Panel */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search categories..."
        filters={searchFilters}
      />

      {/* Table Container */}
      <AdminTable
        loading={loading}
        loadingText="Loading categories..."
        empty={filteredCategories.length === 0}
        emptyTitle="No Categories Found"
        emptyDescription="Try adjusting your filters or create a new category to get started."
        headers={tableHeaders}
      >
        {filteredCategories.map((cat, index) => {
          const formattedIndex = String(index + 1).padStart(2, "0");
          return (
            <tr
              key={cat._id}
              className="border-b border-[#eee] hover:bg-slate-50/50 dark:border-[#2e3a47] dark:hover:bg-[#24303f]/30 transition-all duration-150"
            >
              {/* Index */}
              <td className="px-6 py-5 text-sm font-medium text-slate-400">
                {formattedIndex}
              </td>
              {/* Category Name */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#f7f9fc] dark:bg-[#24303f] border border-[#e2e8f0] dark:border-slate-700 overflow-hidden">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <CategoryIcon className="w-5 h-5 text-[#3c50e0] dark:text-blue-400" />
                    )}
                  </div>
                  <span className="font-semibold text-black dark:text-white">
                    {cat.name}
                  </span>
                </div>
              </td>
              {/* Slug */}
              <td className="px-6 py-5">
                <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-[#24303f] dark:text-slate-300">
                  {cat.slug}
                </span>
              </td>
              {/* Status */}
              <td className="px-6 py-5">
                <button
                  onClick={() => handleToggleStatus(cat._id, cat.status)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    cat.status
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                  }`}
                  title="Click to toggle status"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      cat.status ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {cat.status ? "Active" : "Inactive"}
                </button>
              </td>
              {/* Actions dropdown */}
              <td className="px-6 py-5 text-right relative">
                <div className="inline-block text-left" ref={activeDropdown === cat._id ? dropdownRef : null}>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === cat._id ? null : cat._id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3.5 py-1.5 text-sm font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:hover:bg-[#1c2434] transition-all cursor-pointer shadow-sm"
                  >
                    Actions
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {activeDropdown === cat._id && (
                    <div className="absolute right-0 mt-2 z-50 w-44 rounded-sm border border-[#e2e8f0] bg-white shadow-lg dark:border-[#2e3a47] dark:bg-[#1c2434] transition-all duration-200">
                      <div className="py-1">
                        <Link
                          href={`/admin/category/add?id=${cat._id}`}
                          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                        >
                          Edit
                        </Link>
                        <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                        <button
                          onClick={() => handleToggleStatus(cat._id, cat.status)}
                          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                        >
                          Toggle Status
                        </button>
                        <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-[#24303f] font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
