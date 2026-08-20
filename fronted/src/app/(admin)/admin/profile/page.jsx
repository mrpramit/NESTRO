"use client";

import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  fetchAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
  addAdminAddress,
  deleteAdminAddress,
  setAdminDefaultAddress,
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
    const res = await fetchAdminProfile();
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
    const timeoutId = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateAdminProfile({
      name: form.name,
      mobile: form.mobile,
    });
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
    const res = await addAdminAddress(payload);
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
    const res = await deleteAdminAddress(id);
    if (res.success) {
      toast.success(res.message || "Address deleted");
      await load();
    } else {
      toast.error(res.message || "Could not delete address");
    }
  };

  const handleSetDefault = async (id) => {
    const res = await setAdminDefaultAddress(id);
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
    const res = await deleteAdminProfile();
    if (res.success) {
      toast.success(res.message || "Account deleted");
      // Reload to reflect logged out state
      window.location.href = "/";
    } else {
      toast.error(res.message || "Could not delete account");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-slate-400">
        Loading profile...
      </div>
    );
  }

  const initials = (profile?.name || "Admin")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const inputClass =
    "mt-2 w-full rounded-sm border border-[#2e3a47] bg-[#121824] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:text-slate-500";

  return (
    <div className="mx-auto max-w-screen-xl space-y-6">
      <Toaster position="top-right" richColors />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
          Account settings
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
          Admin Profile
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your administrator identity and saved addresses.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-sm border border-[#2e3a47] bg-[#1c2434] p-6">
          <div className="flex items-center gap-4 xl:block">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#24303f] bg-blue-500/15 text-2xl font-bold text-blue-400">
              {initials}
            </div>
            <div className="mt-0 xl:mt-5">
              <h2 className="text-lg font-semibold text-white">
                {profile?.name || "Admin"}
              </h2>
              <p className="mt-1 break-all text-xs text-slate-400">
                {profile?.email || "No email"}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {profile?.role || "Administrator"}
              </span>
            </div>
          </div>
          <div className="mt-6 border-t border-[#2e3a47] pt-5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Account status</span>
              <span className="font-semibold text-emerald-400">Active</span>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <form
            onSubmit={handleUpdate}
            className="rounded-sm border border-[#2e3a47] bg-[#1c2434]"
          >
            <div className="border-b border-[#2e3a47] px-6 py-5">
              <h2 className="font-semibold text-white">Personal information</h2>
              <p className="mt-1 text-xs text-slate-400">
                Keep your administrator contact details current.
              </p>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email address
                <input value={form.email} disabled className={inputClass} />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Mobile number
                <input
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className={inputClass}
                />
              </label>
            </div>
            <div className="flex justify-end border-t border-[#2e3a47] px-6 py-4">
              <button
                type="submit"
                className="rounded-sm bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Save changes
              </button>
            </div>
          </form>

          <section className="rounded-sm border border-[#2e3a47] bg-[#1c2434]">
            <div className="flex items-center justify-between border-b border-[#2e3a47] px-6 py-5">
              <div>
                <h2 className="font-semibold text-white">Saved addresses</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Addresses available for administrator account actions.
                </p>
              </div>
              <span className="rounded-full bg-[#24303f] px-3 py-1 text-xs font-semibold text-slate-300">
                {profile?.addresses?.length || 0} saved
              </span>
            </div>
            <div className="space-y-3 p-6">
              {profile?.addresses?.length ? (
                profile.addresses.map((addr) => (
                  <div
                    key={addr._id || addr.addressLine}
                    className="flex flex-col gap-4 rounded-sm border border-[#2e3a47] bg-[#121824] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        {addr.fullName}
                        {addr.isDefault && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {addr.country} · {addr.mobile}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(addr._id)}
                          className="rounded-sm border border-[#2e3a47] px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500 hover:text-blue-400"
                        >
                          Make default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="rounded-sm border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-slate-500">
                  No addresses saved yet.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-sm border border-[#2e3a47] bg-[#1c2434]">
            <div className="border-b border-[#2e3a47] px-6 py-5">
              <h2 className="font-semibold text-white">Add an address</h2>
              <p className="mt-1 text-xs text-slate-400">
                Save a frequently used administrator address.
              </p>
            </div>
            <form
              onSubmit={handleAddAddress}
              className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
            >
              <input
                placeholder="Full name"
                value={addressForm.fullName}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, fullName: e.target.value })
                }
                className={inputClass}
              />
              <input
                placeholder="Mobile"
                value={addressForm.mobile}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, mobile: e.target.value })
                }
                className={inputClass}
              />
              <input
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                className={inputClass}
              />
              <input
                placeholder="City"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className={inputClass}
              />
              <input
                placeholder="State"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className={inputClass}
              />
              <input
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
                className={inputClass}
              />
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  id="isDefault"
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
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
                    setAddressForm({
                      ...addressForm,
                      addressLine: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="mt-2 flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-sm bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Save address
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
                  className="rounded-sm border border-[#2e3a47] px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-[#24303f]"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="flex flex-col gap-4 rounded-sm border border-rose-500/20 bg-rose-500/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-rose-300">
                Delete administrator account
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                This permanently removes the account and cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="rounded-sm border border-rose-500/40 px-4 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/10"
            >
              Delete account
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
