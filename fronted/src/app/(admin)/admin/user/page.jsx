"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { fetchUsers, deleteUserByIdApi, updateUserByIdApi } from "@/utils/api";
import PageHeader from "@/components/admin/PageHeader";
import SearchAndFilter from "@/components/admin/SearchAndFilter";
import AdminTable from "@/components/admin/AdminTable";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const loadUsers = async () => {
    const res = await fetchUsers();
    if (res.success) setUsers(res.data || []);
    else toast.error(res.message || "Failed to fetch users");
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      loadUsers();
    }, 0);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    setActiveDropdown(null);
    const payload = { status: !currentStatus };
    const res = await updateUserByIdApi(id, payload);
    if (res.success) {
      toast.success(res.message || "Status updated");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: !currentStatus } : u)),
      );
    } else {
      toast.error(res.message || "Failed to update status");
    }
  };

  const handleDelete = async (id, name) => {
    setActiveDropdown(null);
    const isDark = document.documentElement.classList.contains("dark");
    const result = await Swal.fire({
      title: "Delete User?",
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
      const res = await deleteUserByIdApi(id);
      if (res.success) {
        toast.success(res.message || "Deleted successfully");
        loadUsers();
      } else {
        toast.error(res.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? u.status === true
          : u.status === false;

    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const tableHeaders = [
    { label: "ID", className: "w-20" },
    { label: "Name" },
    { label: "Email" },
    { label: "Role", className: "w-36" },
    { label: "Status", className: "w-40" },
    { label: "Action", className: "text-right w-32" },
  ];

  const searchFilters = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { value: "all", label: "All Roles" },
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
        { value: "superAdmin", label: "Super Admin" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage application users and their details"
        actionText="Create User"
        actionHref="/admin/user/add"
      />

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        filters={searchFilters}
      />

      <AdminTable
        loading={loading}
        loadingText="Loading users..."
        empty={filteredUsers.length === 0}
        emptyTitle="No Users Found"
        emptyDescription="Try adjusting your filters or create a new user."
        headers={tableHeaders}
      >
        {filteredUsers.map((u, index) => {
          const formattedIndex = String(index + 1).padStart(2, "0");
          return (
            <tr
              key={u._id}
              className="border-b border-[#eee] hover:bg-slate-50/50 dark:border-[#2e3a47] dark:hover:bg-[#24303f]/30 transition-all duration-150"
            >
              <td className="px-6 py-5 text-sm font-medium text-slate-400">
                {formattedIndex}
              </td>
              <td className="px-6 py-5">
                {" "}
                <span className="font-semibold text-black dark:text-white">
                  {u.name}
                </span>{" "}
              </td>
              <td className="px-6 py-5">
                {" "}
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {u.email}
                </span>{" "}
              </td>
              <td className="px-6 py-5">
                {" "}
                <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-[#24303f] dark:text-slate-300">
                  {u.role}
                </span>{" "}
              </td>
              <td className="px-6 py-5">
                <button
                  onClick={() => handleToggleStatus(u._id, u.status)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${u.status ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${u.status ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  {u.status ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-6 py-5 text-right relative">
                <div
                  className="inline-block text-left"
                  ref={activeDropdown === u._id ? dropdownRef : null}
                >
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === u._id ? null : u._id)
                    }
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-3.5 py-1.5 text-sm font-medium text-black hover:bg-slate-50 dark:border-[#2e3a47] dark:bg-[#24303f] dark:text-white dark:hover:bg-[#1c2434] transition-all cursor-pointer shadow-sm"
                  >
                    Actions
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {activeDropdown === u._id && (
                    <div className="absolute right-0 mt-2 z-50 w-44 rounded-sm border border-[#e2e8f0] bg-white shadow-lg dark:border-[#2e3a47] dark:bg-[#1c2434] transition-all duration-200">
                      <div className="py-1">
                        <Link
                          href={`/admin/user/add?id=${u._id}`}
                          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                        >
                          Edit
                        </Link>
                        <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#24303f] transition-colors"
                        >
                          Toggle Status
                        </button>
                        <hr className="border-[#e2e8f0] dark:border-[#2e3a47] my-1" />
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
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
