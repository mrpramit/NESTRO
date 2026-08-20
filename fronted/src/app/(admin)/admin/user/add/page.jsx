"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  fetchUserByIdApi,
  updateUserByIdApi,
  registerUser,
  cancelOrderApi,
} from "@/utils/api";
import PageHeader from "@/components/admin/PageHeader";
import {
  FormInput,
  FormSelect,
  FormCheckbox,
} from "@/components/admin/FormFields";

export default function AddUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [orderPendingCancellation, setOrderPendingCancellation] =
    useState(null);

  useEffect(() => {
    if (editId) {
      const load = async () => {
        setLoading(true);
        const res = await fetchUserByIdApi(editId);
        if (res.success && res.data) {
          setUserData(res.data);
          setName(res.data.user?.name || "");
          setEmail(res.data.user?.email || "");
          setMobile(res.data.user?.mobile || "");
          setRole(res.data.user?.role || "user");
          setStatus(res.data.user?.status !== false);
        } else {
          toast.error(res.message || "Failed to load user");
        }
        setLoading(false);
      };
      load();
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (editId) {
      const payload = { name, email, mobile, role, status };
      const res = await updateUserByIdApi(editId, payload);
      if (res.success) {
        toast.success(res.message || "User updated");
        router.push("/admin/user");
      } else {
        toast.error(res.message || "Failed to update user");
      }
    } else {
      // Create via register endpoint (admin will trigger OTP email)
      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setSubmitting(false);
        return;
      }
      const res = await registerUser({ name, email, password });
      if (res.success) {
        toast.success(res.message || "User created (OTP sent)");
        router.push("/admin/user");
      } else {
        toast.error(res.message || "Failed to create user");
      }
    }

    setSubmitting(false);
  };

  const handleCancelOrder = async (orderId) => {
    setCancellingOrderId(orderId);
    const res = await cancelOrderApi(orderId);
    if (res.success && res.data) {
      setUserData((current) => ({
        ...current,
        orders: current.orders.map((order) =>
          order._id === orderId ? res.data : order,
        ),
      }));
      toast.success(res.message || "Order cancelled");
    } else {
      toast.error(res.message || "Could not cancel order");
    }
    setCancellingOrderId(null);
    setOrderPendingCancellation(null);
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
      <PageHeader
        title={editId ? "Edit User" : "Create User"}
        description={
          editId
            ? "Modify user details"
            : "Create a new user (OTP will be sent)"
        }
        backHref="/admin/user"
      />

      <div className="rounded-sm border border-[#e2e8f0] bg-white shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
        <div className="border-b border-[#e2e8f0] px-6.5 py-4 dark:border-[#2e3a47]">
          <h3 className="font-semibold text-black dark:text-white">
            {editId ? "Edit User Details" : "User Details"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6.5 space-y-6">
          <FormInput
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormInput
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            label="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <FormSelect
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
              { value: "superAdmin", label: "Super Admin" },
            ]}
          />

          <FormCheckbox
            label="Active"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            description="Toggle user active/inactive status"
          />

          {!editId && (
            <FormInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Temporary password — user will receive OTP to verify."
            />
          )}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#e2e8f0] dark:border-[#2e3a47]">
            <Link
              href="/admin/user"
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
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Addresses & Orders */}
      {userData && (
        <div className="space-y-6">
          <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              Addresses
            </h3>
            {userData.user?.addresses?.length > 0 ? (
              <div className="space-y-3">
                {userData.user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="rounded-sm border border-[#e2e8f0] p-4 dark:border-[#2e3a47]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-black dark:text-white">
                          {addr.fullName}{" "}
                          {addr.isDefault && (
                            <span className="ml-2 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          {addr.country} • {addr.mobile}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                No addresses found for this user.
              </div>
            )}
          </div>

          <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              Order History
            </h3>
            {userData.orders && userData.orders.length > 0 ? (
              <div className="space-y-3">
                {userData.orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-sm border border-[#e2e8f0] p-4 dark:border-[#2e3a47]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-black dark:text-white">
                          Order #{order._id}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Placed on:{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Total: ₹
                          {order.grandTotal?.toLocaleString?.() ||
                            order.grandTotal}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-sm text-slate-500">
                        <span>Status: {order.status || "—"}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrderId(
                                expandedOrderId === order._id
                                  ? null
                                  : order._id,
                              )
                            }
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                          >
                            {expandedOrderId === order._id
                              ? "Hide details"
                              : "View details"}
                          </button>
                          {!["cancelled", "delivered", "completed"].includes(
                            order.status,
                          ) && (
                            <button
                              type="button"
                              disabled={cancellingOrderId === order._id}
                              onClick={() => setOrderPendingCancellation(order)}
                              className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50"
                            >
                              {cancellingOrderId === order._id
                                ? "Cancelling..."
                                : "Cancel order"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedOrderId === order._id && (
                      <div className="mt-4 grid gap-4 border-t border-[#e2e8f0] pt-4 text-sm dark:border-[#2e3a47] md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-black dark:text-white">
                            Items
                          </h4>
                          <div className="space-y-1 text-slate-600 dark:text-slate-300">
                            {(order.items || []).map((item, index) => (
                              <div key={`${order._id}-item-${index}`}>
                                {item.name || "Product"} x {item.quantity || 1}{" "}
                                - ₹{(item.price || 0).toLocaleString()}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-black dark:text-white">
                            Payment & pricing
                          </h4>
                          <div className="space-y-1 text-slate-600 dark:text-slate-300">
                            <div>Payment: {order.paymentMethod || "—"}</div>
                            <div>
                              Subtotal: ₹
                              {(order.subtotal || 0).toLocaleString()}
                            </div>
                            <div>
                              Shipping: ₹
                              {(order.shippingCost || 0).toLocaleString()}
                            </div>
                            <div>
                              Tax: ₹{(order.estimatedTax || 0).toLocaleString()}
                            </div>
                            <div>
                              Discount: ₹
                              {(order.discountAmount || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-black dark:text-white">
                            Customer contact
                          </h4>
                          <div className="text-slate-600 dark:text-slate-300">
                            <div>
                              {order.contactInfo?.name || userData.user?.name}
                            </div>
                            <div>
                              {order.contactInfo?.email || userData.user?.email}
                            </div>
                            <div>
                              {order.contactInfo?.mobile ||
                                userData.user?.mobile ||
                                "—"}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-black dark:text-white">
                            Shipping address
                          </h4>
                          <div className="text-slate-600 dark:text-slate-300">
                            {order.shippingAddress?.addressLine || "—"},{" "}
                            {order.shippingAddress?.city || ""},{" "}
                            {order.shippingAddress?.state || ""} -{" "}
                            {order.shippingAddress?.pincode || ""}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                No orders found for this user.
              </div>
            )}
          </div>
        </div>
      )}

      {orderPendingCancellation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOrderPendingCancellation(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-xl dark:border-[#2e3a47] dark:bg-[#1c2434]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
          >
            <h2
              id="cancel-order-title"
              className="text-lg font-semibold text-black dark:text-white"
            >
              Cancel this order?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Order #{orderPendingCancellation._id} will be marked as cancelled.
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOrderPendingCancellation(null)}
                disabled={Boolean(cancellingOrderId)}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Keep order
              </button>
              <button
                type="button"
                onClick={() => handleCancelOrder(orderPendingCancellation._id)}
                disabled={Boolean(cancellingOrderId)}
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {cancellingOrderId ? "Cancelling..." : "Yes, cancel order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
