"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  fetchProducts,
  deleteProduct,
  toggleProductStatus,
  toggleProductField,
  fetchCategories,
  fetchRooms
} from "@/utils/api";
import { ProductIcon, CategoryIcon, RoomIcon } from "@/components/admin/Icons";
import PageHeader from "@/components/admin/PageHeader";
import SearchAndFilter from "@/components/admin/SearchAndFilter";
import AdminTable from "@/components/admin/AdminTable";
import Pagination from "@/components/admin/Pagination";
import ProductDetailsModal from "@/components/admin/ProductDetailsModal";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page to 1 when filters or search term changes
  useEffect(() => {
    setTimeout(() => {
      setCurrentPage(1);
    }, 0);
  }, [searchTerm, categoryFilter, roomFilter, statusFilter]);

  // Load all data
  const loadData = async () => {
    try {
      const [prodRes, catRes, roomRes] = await Promise.all([
        fetchProducts({ limit: 100 }), // Fetch more products for client-side pagination
        fetchCategories(),
        fetchRooms()
      ]);

      if (prodRes.success) {
        setProducts(prodRes.data);
      } else {
        toast.error(prodRes.message || "Failed to fetch products");
      }

      if (catRes.success) {
        setCategories(catRes.data);
      }

      if (roomRes.success) {
        setRooms(roomRes.data);
      }
    } catch (err) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadData();
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

  // Handle boolean field toggle (stock, featured, bestSeller, newArrival)
  const handleToggleField = async (id, flag, currentValue) => {
    const response = await toggleProductField(id, flag);
    if (response.success) {
      toast.success(`${flag.charAt(0).toUpperCase() + flag.slice(1)} updated successfully`);
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === id ? { ...prod, [flag]: !currentValue } : prod
        )
      );
    } else {
      toast.error(response.message || "Failed to update field");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id, currentStatus) => {
    setActiveDropdown(null);
    const response = await toggleProductStatus(id);
    if (response.success) {
      toast.success("Status updated successfully");
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === id ? { ...prod, status: !currentStatus } : prod
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
      title: "Delete Product?",
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
      const response = await deleteProduct(id);
      if (response.success) {
        toast.success("Product deleted successfully");
        loadData();
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    }
  };

  // Filter logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (prod.categoryId && (prod.categoryId._id === categoryFilter || prod.categoryId.slug === categoryFilter));

    const matchesRoom =
      roomFilter === "all" ||
      (prod.roomId && (prod.roomId._id === roomFilter || prod.roomId.slug === roomFilter));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? prod.status === true
        : prod.status === false;

    return matchesSearch && matchesCategory && matchesRoom && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const tableHeaders = [
    { label: "ID", className: "w-12 text-center" },
    { label: "Product" },
    { label: "Category" },
    { label: "Room Type" },
    { label: "Pricing" },
    { label: "Attributes", className: "text-center" },
    { label: "Status", className: "text-center w-24" },
    { label: "Action", className: "text-right w-24" }
  ];

  const searchFilters = [
    {
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: "all", label: "All Categories" },
        ...categories.map((cat) => ({ value: cat._id, label: cat.name }))
      ]
    },
    {
      value: roomFilter,
      onChange: setRoomFilter,
      options: [
        { value: "all", label: "All Room Types" },
        ...rooms.map((room) => ({ value: room._id, label: room.name }))
      ]
    },
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
        title="Product List"
        description="Manage your furniture products inventory"
        actionText="Create Product"
        actionHref="/admin/product/add"
      />

      {/* Filter and Search Panel */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search products..."
        filters={searchFilters}
      />

      {/* Table Container */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300 overflow-x-auto no-scrollbar w-full">
        <AdminTable
          loading={loading}
          loadingText="Loading products..."
          empty={filteredProducts.length === 0}
          emptyTitle="No Products Found"
          emptyDescription="Try adjusting your filters or create a new product to get started."
          headers={tableHeaders}
        >
          {paginatedProducts.map((prod, index) => {
            const formattedIndex = String(startIndex + index + 1).padStart(2, "0");
            return (
              <tr
                key={prod._id}
                className="border-b border-[#eee] hover:bg-slate-50/50 dark:border-[#2e3a47] dark:hover:bg-[#24303f]/30 transition-all duration-150 cursor-pointer"
                onClick={(e) => {
                  if (
                    e.target.closest("button") ||
                    e.target.closest("a") ||
                    e.target.closest(".absolute") ||
                    e.target.closest("input")
                  ) {
                    return;
                  }
                  setSelectedProduct(prod);
                }}
              >
                {/* Index */}
                <td className="px-3.5 py-4 text-center text-sm font-medium text-slate-400">
                  {formattedIndex}
                </td>

                {/* Product Thumbnail & Name */}
                <td className="px-3.5 py-4 max-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#f7f9fc] dark:bg-[#24303f] border border-[#e2e8f0] dark:border-slate-700 overflow-hidden shrink-0">
                      {prod.thumbnail ? (
                        <img
                          src={prod.thumbnail}
                          alt={prod.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ProductIcon className="w-5 h-5 text-[#3c50e0] dark:text-blue-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block font-semibold text-black dark:text-white truncate" title={prod.name}>
                        {prod.name}
                      </span>
                      <span className="block text-xs text-slate-400 font-medium truncate" title={prod.slug}>
                        Slug: {prod.slug}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-3.5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CategoryIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    {prod.categoryId?.name || "Unknown"}
                  </span>
                </td>

                {/* Room Type */}
                <td className="px-3.5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <RoomIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    {prod.roomId?.name || "Unknown"}
                  </span>
                </td>

                {/* Pricing */}
                <td className="px-3.5 py-4">
                  <div>
                    <span className="block font-bold text-black dark:text-white whitespace-nowrap">
                      ₹{prod.salePrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 whitespace-nowrap">
                      <span className="line-through">₹{prod.originalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="text-emerald-500">(-{prod.discount}%)</span>
                    </div>
                  </div>
                </td>

                {/* Attribute Badges / Toggles */}
                <td className="px-3.5 py-4">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[220px] mx-auto">
                    {/* Stock Toggle */}
                    <button
                      onClick={() => handleToggleField(prod._id, "stock", prod.stock)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                        prod.stock
                          ? "bg-emerald-55 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                          : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                      }`}
                      title="Toggle Stock Availability"
                    >
                      Stock: {prod.stock ? "In Stock" : "Out of Stock"}
                    </button>

                    {/* Featured Toggle */}
                    <button
                      onClick={() => handleToggleField(prod._id, "featured", prod.featured)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                        prod.featured
                          ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                      }`}
                      title="Toggle Featured"
                    >
                      Featured
                    </button>

                    {/* BestSeller Toggle */}
                    <button
                      onClick={() => handleToggleField(prod._id, "bestSeller", prod.bestSeller)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                        prod.bestSeller
                          ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                          : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                      }`}
                      title="Toggle Best Seller"
                    >
                      Best Seller
                    </button>

                    {/* New Arrival Toggle */}
                    <button
                      onClick={() => handleToggleField(prod._id, "newArrival", prod.newArrival)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full cursor-pointer transition-colors border whitespace-nowrap ${
                        prod.newArrival
                          ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                          : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                      }`}
                      title="Toggle New Arrival"
                    >
                      New Arrival
                    </button>
                  </div>
                </td>

                {/* Status Toggle */}
                <td className="px-3.5 py-4 text-center">
                  <button
                    onClick={() => handleToggleStatus(prod._id, prod.status)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      prod.status
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                    }`}
                    title="Click to toggle status"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        prod.status ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {prod.status ? "Active" : "Inactive"}
                  </button>
                </td>

                {/* Action Dropdown */}
                <td className="px-3.5 py-4 text-right relative">
                  <div className="inline-block text-left" ref={activeDropdown === prod._id ? dropdownRef : null}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === prod._id ? null : prod._id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:hover:bg-[#1c2434] transition-all cursor-pointer shadow-sm"
                    >
                      Actions
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {activeDropdown === prod._id && (
                      <div className="absolute right-0 mt-2 z-50 w-44 rounded-sm border border-[#e2e8f0] bg-white shadow-lg dark:border-[#2e3a47] dark:bg-[#1c2434] transition-all duration-200">
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProduct(prod);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-left font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                          <Link
                            href={`/admin/product/add?id=${prod._id}`}
                            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                          >
                            Edit
                          </Link>
                          <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                          <button
                            onClick={() => handleToggleStatus(prod._id, prod.status)}
                            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                          >
                            Toggle Status
                          </button>
                          <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                          <button
                            onClick={() => handleDelete(prod._id, prod.name)}
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
        
        {/* Pagination Panel */}
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
