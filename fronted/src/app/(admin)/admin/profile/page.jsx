"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  fetchProfile,
  updateProfile,
  addAddressApi,
  deleteAddressApi,
  setDefaultAddressApi,
  deleteAccountApi,
} from "@/utils/api";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
    country: "India",
    isDefault: false,
  });

  const load = async () => {
    setLoading(true);
    const res = await fetchProfile();
    if (res && res.success) {
      const user = res.user || res.data || null;
      setProfile(user);
      setForm({
        name: (user && user.name) || "",
        email: (user && user.email) || "",
        mobile: (user && user.mobile) || "",
      });
    } else {
      toast.error(res.message || "Could not fetch profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name: form.name, mobile: form.mobile });
    if (res.success) {
      toast.success(res.message || "Profile updated");
      await load();
    } else {
      toast.error(res.message || "Update failed");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const payload = { ...addressForm };
    const res = await addAddressApi(payload);
    if (res.success) {
      toast.success(res.message || "Address added");
      setAddressForm({
        fullName: "",
        mobile: "",
        pincode: "",
        addressLine: "",
        city: "",
        state: "",
        country: "India",
        isDefault: false,
      });
      await load();
    } else {
      toast.error(res.message || "Could not add address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;
    const res = await deleteAddressApi(id);
    if (res.success) {
      toast.success(res.message || "Address deleted");
      await load();
    } else {
      toast.error(res.message || "Could not delete address");
    }
  };

  const handleSetDefault = async (id) => {
    const res = await setDefaultAddressApi(id);
    if (res.success) {
      toast.success(res.message || "Default set");
      await load();
    } else {
      toast.error(res.message || "Could not set default");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    const res = await deleteAccountApi();
    if (res.success) {
      toast.success(res.message || "Account deleted");
      // Reload to reflect logged out state
      window.location.href = "/";
    } else {
      toast.error(res.message || "Could not delete account");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-center" richColors />

      <h1 className="text-2xl font-semibold mb-4">Admin Profile</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              value={form.email}
              disabled
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete Account
          </button>
        </div>
      </form>

      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-3">Addresses</h2>
        {profile?.addresses?.length ? (
          <div className="space-y-4">
            {profile.addresses.map((addr) => (
              <div
                key={addr._id || addr.addressLine}
                className="border p-3 rounded flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">
                    {addr.fullName}{" "}
                    {addr.isDefault ? (
                      <span className="text-sm text-green-600">(Default)</span>
                    ) : null}
                  </div>
                  <div className="text-sm">
                    {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                    {addr.pincode}
                  </div>
                  <div className="text-sm">{addr.mobile}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-sm px-3 py-1 bg-yellow-400 rounded"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No addresses found.</div>
        )}
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-medium mb-3">Add Address</h2>
        <form
          onSubmit={handleAddAddress}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            placeholder="Full name"
            value={addressForm.fullName}
            onChange={(e) =>
              setAddressForm({ ...addressForm, fullName: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Mobile"
            value={addressForm.mobile}
            onChange={(e) =>
              setAddressForm({ ...addressForm, mobile: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Pincode"
            value={addressForm.pincode}
            onChange={(e) =>
              setAddressForm({ ...addressForm, pincode: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="City"
            value={addressForm.city}
            onChange={(e) =>
              setAddressForm({ ...addressForm, city: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="State"
            value={addressForm.state}
            onChange={(e) =>
              setAddressForm({ ...addressForm, state: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Country"
            value={addressForm.country}
            onChange={(e) =>
              setAddressForm({ ...addressForm, country: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <div className="flex items-center gap-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
            />
            <label htmlFor="isDefault" className="text-sm">
              Set as default
            </label>
          </div>
          <div>
            <input
              placeholder="Address line"
              value={addressForm.addressLine}
              onChange={(e) =>
                setAddressForm({ ...addressForm, addressLine: e.target.value })
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="md:col-span-2 flex gap-2 mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Add Address
            </button>
            <button
              type="button"
              onClick={() =>
                setAddressForm({
                  fullName: "",
                  mobile: "",
                  pincode: "",
                  addressLine: "",
                  city: "",
                  state: "",
                  country: "India",
                  isDefault: false,
                })
              }
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
