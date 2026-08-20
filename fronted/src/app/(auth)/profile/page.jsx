"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  fetchUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  setUserDefaultAddress,
} from "@/utils/api";
import { createOrderApi } from "@/utils/api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLogOut,
  FiHome,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiPackage,
  FiShoppingBag,
  FiClock,
  FiTruck,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import ProductIllustration from "@/components/website/ProductIllustration";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // orders | addresses | edit-profile
  const [orders, setOrders] = useState([]);

  // Modals & Forms State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
    isDefault: false,
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    mobile: "",
  });

  const loadProfile = async () => {
    try {
      const res = await fetchUserProfile();
      if (res.success && res.user) {
        setUser(res.user);
        setProfileForm({
          name: res.user.name || "",
          mobile: res.user.mobile || "",
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("nestro_user", JSON.stringify(res.user));

          setOrders(res.orders || []);
        }
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("nestro_user");
        }
        toast.error("Please sign in to view your profile");
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("Profile load error:", err);
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProfile();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nestro_user");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    toast.success("Logged out successfully");
    router.push("/sign-in");
  };

  // Reorder Item (Add to Cart)
  const handleReorderItem = (item) => {
    dispatch(
      addToCart({
        id: item.id || `reorder-${item.name}-${item.price}`,
        name: item.name,
        price: item.price,
        thumbnail: item.thumbnail,
        color: item.color || "Standard",
        material: item.material || "Wood",
        quantity: item.quantity || 1,
      }),
    );
    toast.success(`${item.name} added back to your cart!`);
  };

  // Profile Edit Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name) {
      toast.error("Name field is required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateUserProfile(profileForm);
      if (res.success && res.user) {
        setUser(res.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("nestro_user", JSON.stringify(res.user));
        }
        toast.success("Profile details updated successfully!");
        setActiveTab("orders");
      } else {
        toast.error(res.message || "Failed to update profile details");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Address Form Change
  const handleAddressFormChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  // Add Address Submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (
      !addressForm.fullName ||
      !addressForm.mobile ||
      !addressForm.pincode ||
      !addressForm.addressLine ||
      !addressForm.city ||
      !addressForm.state
    ) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await addUserAddress(addressForm);
      if (res.success && res.user) {
        setUser(res.user);
        toast.success("New address saved successfully!");
        setShowAddressModal(false);
        setAddressForm({
          fullName: "",
          mobile: "",
          pincode: "",
          addressLine: "",
          city: "",
          state: "",
          isDefault: false,
        });
      } else {
        toast.error(res.message || "Failed to add address");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Address Handler
  const handleDeleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: "Delete Address?",
      text: "Are you sure you want to delete this shipping address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8C6239",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#281C19",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteUserAddress(addressId);
        if (res.success && res.user) {
          setUser(res.user);
          toast.success("Address deleted successfully!");
        } else {
          toast.error(res.message || "Failed to delete address");
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Set Address Default Handler
  const handleSetDefaultAddress = async (addressId) => {
    try {
      const res = await setUserDefaultAddress(addressId);
      if (res.success && res.user) {
        setUser(res.user);
        toast.success("Default address updated successfully!");
      } else {
        toast.error(res.message || "Failed to update default address");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#8C6239] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-[#8C6239] tracking-wider uppercase">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="w-full max-w-5xl bg-white border border-[#EFE8DF] rounded-[32px] overflow-hidden shadow-xl shadow-[#8C6239]/5 flex flex-col md:flex-row min-h-[550px] my-6">
      {/* LEFT SIDEBAR: Personal Card info & Navigation */}
      <div className="w-full md:w-[28%] bg-[#FAF7F2] border-r border-[#EFE8DF] p-6 flex flex-col justify-between items-center md:items-start text-center md:text-left gap-8 flex-shrink-0">
        <div className="space-y-6 w-full flex flex-col items-center md:items-start">
          {/* Avatar representation */}
          <div className="w-20 h-20 rounded-3xl bg-[#8C6239] text-[#FAF7F2] flex items-center justify-center font-black text-2xl shadow-md border-2 border-white ring-8 ring-[#8C6239]/10">
            {initials}
          </div>

          {/* User names */}
          <div className="space-y-1 w-full">
            <h2 className="text-lg font-extrabold text-[#281C19] truncate">
              {user.name}
            </h2>
            <p className="text-xs text-[#8A7973] truncate">{user.email}</p>
            <span className="inline-block text-[8px] font-black tracking-widest bg-[#3E2A24] text-white px-2.5 py-0.5 rounded-full uppercase mt-1">
              {user.role || "Verified Customer"}
            </span>
          </div>

          {/* Navigation/Tabs Buttons */}
          <div className="w-full space-y-1 pt-4 border-t border-[#EFE8DF]">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "orders"
                  ? "bg-white text-[#8C6239] shadow-sm border border-[#EFE8DF]"
                  : "text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              <div className="flex items-center gap-2">
                <FiPackage className="w-4 h-4" />
                <span>Order History</span>
              </div>
              <span className="text-[10px] font-extrabold bg-[#FAF7F2] text-[#8C6239] px-2 py-0.5 rounded-full border border-[#EFE8DF]">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-white text-[#8C6239] shadow-sm border border-[#EFE8DF]"
                  : "text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              <FiMapPin className="w-4 h-4" />
              My Addresses
            </button>

            <button
              onClick={() => setActiveTab("edit-profile")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "edit-profile"
                  ? "bg-white text-[#8C6239] shadow-sm border border-[#EFE8DF]"
                  : "text-[#8A7973] hover:text-[#281C19]"
              }`}
            >
              <FiEdit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Logout and home trigger actions */}
        <div className="w-full space-y-2 pt-4 border-t border-[#EFE8DF]">
          <Link
            href="/store"
            className="w-full bg-white border border-[#EFE8DF] hover:border-[#8C6239]/40 text-[#8A7973] hover:text-[#8C6239] font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <FiHome className="w-4 h-4" />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Dashboard Tab Content */}
      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[750px]">
        {/* TAB 1: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFE8DF] pb-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#281C19]">
                  Order History
                </h3>
                <p className="text-xs text-[#8A7973]">
                  Track, view, and re-order your previous purchases.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    // Sync local orders to backend
                    if (!user) {
                      toast.error("Please sign in to sync orders");
                      return;
                    }
                    const raw = localStorage.getItem("nestro_orders");
                    if (!raw) {
                      toast.info("No local orders to sync");
                      return;
                    }
                    let parsed = [];
                    try {
                      parsed = JSON.parse(raw) || [];
                    } catch (e) {
                      toast.error("Could not read local orders");
                      return;
                    }
                    if (!Array.isArray(parsed) || parsed.length === 0) {
                      toast.info("No local orders to sync");
                      return;
                    }

                    toast.info(`Syncing ${parsed.length} orders to server...`);
                    let success = 0;
                    for (const o of parsed) {
                      const payload = {
                        orderId:
                          o.orderId || `NES-${Date.now().toString().slice(-6)}`,
                        userId: user._id,
                        items: o.items || o.itemsOrdered || [],
                        subtotal: o.subtotal || o.subTotal || 0,
                        discountAmount: o.discountAmount || o.discount || 0,
                        shippingCost: o.shippingCost || 0,
                        estimatedTax: o.estimatedTax || 0,
                        grandTotal: o.grandTotal || o.total || 0,
                        contactInfo: o.contactInfo || {
                          name: user.name,
                          email: user.email,
                        },
                        shippingAddress: o.shippingAddress || o.address || {},
                        paymentMethod: o.paymentMethod || o.payment || "COD",
                        status: o.status || "confirmed",
                      };
                      try {
                        const res = await createOrderApi(payload);
                        if (res.success) success += 1;
                      } catch (err) {
                        // ignore per-order errors
                        console.warn("Order sync failed", err);
                      }
                    }
                    toast.success(
                      `Synced ${success}/${parsed.length} orders to server`,
                    );
                  }}
                  className="text-xs font-bold bg-white border border-[#EFE8DF] px-3 py-1 rounded-full hover:shadow-sm"
                >
                  Sync orders to server
                </button>
                <span className="text-xs font-bold text-[#8C6239] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#EFE8DF]">
                  {orders.length} Total Orders
                </span>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order, idx) => (
                  <div
                    key={order.orderId || idx}
                    className="bg-white border border-[#EFE8DF] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Order Card Top Header */}
                    <div className="bg-[#FAF7F2] p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#EFE8DF]">
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider block">
                            Order Number
                          </span>
                          <span className="font-extrabold text-[#281C19] text-sm">
                            {order.orderId}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-[#EFE8DF] hidden sm:block" />
                        <div>
                          <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider block">
                            Placed On
                          </span>
                          <span className="font-bold text-[#281C19]">
                            {order.date}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-[#EFE8DF] hidden sm:block" />
                        <div>
                          <span className="text-[10px] font-bold text-[#8A7973] uppercase tracking-wider block">
                            Total Paid
                          </span>
                          <span className="font-extrabold text-[#8C6239]">
                            ₹
                            {order.grandTotal
                              ? order.grandTotal.toLocaleString("en-IN")
                              : "0"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                          <FiCheck className="w-3 h-3" />{" "}
                          {order.status || "Confirmed"}
                        </span>
                      </div>
                    </div>

                    {/* Items List inside Order Card */}
                    <div className="p-4 md:p-5 space-y-4">
                      <div className="space-y-3">
                        {order.items &&
                          order.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-14 h-14 bg-[#FAF7F2] rounded-xl p-1.5 flex items-center justify-center border border-[#EFE8DF] flex-shrink-0">
                                  {item.thumbnail &&
                                  item.thumbnail.startsWith("http") ? (
                                    <img
                                      src={item.thumbnail}
                                      alt={item.name}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  ) : (
                                    <ProductIllustration name={item.name} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-[#281C19] truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-[10px] text-[#8A7973] mt-0.5">
                                    Qty: {item.quantity} • Color:{" "}
                                    {item.color || "Standard"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-xs font-bold text-[#281C19]">
                                  ₹
                                  {(item.price * item.quantity).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                                <button
                                  onClick={() => handleReorderItem(item)}
                                  className="text-[10px] font-bold text-[#8C6239] bg-[#FAF7F2] hover:bg-[#F3ECE4] px-2.5 py-1 rounded-lg border border-[#EFE8DF] flex items-center gap-1 transition-all cursor-pointer"
                                  title="Add to cart again"
                                >
                                  <FiRefreshCw className="w-3 h-3" /> Buy Again
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Card Footer: Delivery & Payment Details */}
                      <div className="bg-[#FAF7F2] rounded-xl p-3.5 flex flex-wrap items-center justify-between text-xs text-[#8A7973] gap-2 border border-[#EFE8DF]">
                        <div>
                          <span className="font-bold text-[#281C19]">
                            Delivery Address:{" "}
                          </span>
                          {order.shippingAddress ? (
                            <span>
                              {order.shippingAddress.addressLine},{" "}
                              {order.shippingAddress.city} -{" "}
                              {order.shippingAddress.pincode}
                            </span>
                          ) : (
                            <span>On File</span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#281C19]">
                            Payment:{" "}
                          </span>
                          <span className="font-bold text-[#8C6239]">
                            {order.paymentMethod || "COD"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF7F2]/40 border border-dashed border-[#EFE8DF] rounded-[24px] p-12 text-center space-y-4">
                <FiShoppingBag className="w-10 h-10 text-[#8A7973]/50 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#281C19]">
                    No Order History Found
                  </p>
                  <p className="text-xs text-[#8A7973]">
                    You have not placed any furniture orders with Nestro yet.
                  </p>
                </div>
                <Link
                  href="/store"
                  className="bg-[#8C6239] hover:bg-[#724E2B] text-white text-xs font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm"
                >
                  Explore Store Collection
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            {/* Addresses Header */}
            <div className="flex items-center justify-between border-b border-[#EFE8DF] pb-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-[#281C19]">
                  Shipping Addresses
                </h3>
                <p className="text-xs text-[#8A7973]">
                  Manage your saved delivery locations.
                </p>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="bg-[#8C6239] hover:bg-[#724E2B] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <FiPlus className="w-4 h-4" />
                Add Address
              </button>
            </div>

            {/* Addresses Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`bg-white border rounded-2xl p-5 space-y-3 relative flex flex-col justify-between transition-all ${
                      addr.isDefault
                        ? "border-[#8C6239] shadow-sm shadow-[#8C6239]/5"
                        : "border-[#EFE8DF] hover:border-[#8C6239]/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-12">
                        <span className="font-bold text-xs text-[#281C19] block">
                          {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[8px] font-black text-[#8C6239] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#8C6239]/20 uppercase tracking-widest flex-shrink-0">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#8A7973] leading-relaxed">
                        {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                        <span className="font-bold text-[#281C19]">
                          {addr.pincode}
                        </span>
                      </p>

                      <div className="text-[10px] font-bold text-[#281C19] flex items-center gap-1.5">
                        <FiPhone className="w-3.5 h-3.5 text-[#8C6239]" />{" "}
                        {addr.mobile}
                      </div>
                    </div>

                    {/* Actions on address */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#FAF7F2] mt-2 gap-4">
                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <FiCheck className="w-3.5 h-3.5" /> Primary Address
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultAddress(addr._id)}
                          className="text-[10px] font-bold text-[#8C6239] hover:underline cursor-pointer"
                        >
                          Set as default
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Address"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-[#FAF7F2]/40 border border-dashed border-[#EFE8DF] rounded-[24px] p-10 text-center space-y-3">
                  <FiMapPin className="w-8 h-8 text-[#8A7973]/50 mx-auto" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#281C19]">
                      No shipping addresses
                    </p>
                    <p className="text-[11px] text-[#8A7973]">
                      Add a delivery address to start checking out purchases.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="bg-[#8C6239] hover:bg-[#724E2B] text-white text-xs font-bold py-2 px-4 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Save First Address
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === "edit-profile" && (
          <div className="space-y-6">
            {/* Edit Profile Header */}
            <div className="space-y-0.5 border-b border-[#EFE8DF] pb-4">
              <h3 className="text-base font-bold text-[#281C19]">
                Profile Configuration
              </h3>
              <p className="text-xs text-[#8A7973]">
                Update your account names and contact details.
              </p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-md">
              {/* Full Name field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7973]">
                    <FiUser className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    name="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    placeholder="User Name"
                    disabled={submitting}
                    className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl pl-11 pr-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Mobile Number field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7973]">
                    <FiPhone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="mobile"
                    value={profileForm.mobile}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, mobile: e.target.value })
                    }
                    placeholder="Enter phone number"
                    disabled={submitting}
                    className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl pl-11 pr-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Save changes button */}
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#8C6239] hover:bg-[#724E2B] text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
              >
                {submitting ? "Saving changes..." : "Save changes"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ADDRESS DETAILS MODAL DIALOG */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#EFE8DF] rounded-[32px] max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-6 right-6 text-[#8A7973] hover:text-[#281C19] transition-colors p-1"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="space-y-0.5">
              <h3 className="text-lg font-bold text-[#281C19]">
                Add Shipping Address
              </h3>
              <p className="text-xs text-[#8A7973]">
                Enter details for order deliveries.
              </p>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                  Receiver Full Name
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={addressForm.fullName}
                  onChange={handleAddressFormChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl px-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all"
                />
              </div>

              {/* Mobile and pincode grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                    Contact Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    name="mobile"
                    value={addressForm.mobile}
                    onChange={handleAddressFormChange}
                    placeholder="e.g. +91 9988776655"
                    className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl px-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressFormChange}
                    placeholder="6-digit ZIP/Pincode"
                    className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl px-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                  Address Line
                </label>
                <input
                  type="text"
                  required
                  name="addressLine"
                  value={addressForm.addressLine}
                  onChange={handleAddressFormChange}
                  placeholder="Flat, House no., Apartment, Street, Area"
                  className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl px-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    placeholder="City"
                    className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl px-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#281C19] uppercase tracking-wider block">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressFormChange}
                    placeholder="State"
                    className="w-full bg-[#FAF7F2]/50 border border-[#EFE8DF] rounded-xl px-4 py-3 text-xs text-[#281C19] focus:outline-none focus:border-[#8C6239] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Default checkbox options */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A7973] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        isDefault: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#8C6239] rounded cursor-pointer"
                  />
                  Mark as my primary/default delivery address
                </label>
              </div>

              {/* Buttons options */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 bg-white border border-[#EFE8DF] hover:border-[#8C6239]/40 text-[#8A7973] hover:text-[#281C19] font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#8C6239] hover:bg-[#724E2B] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
