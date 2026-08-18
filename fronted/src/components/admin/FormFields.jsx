import React from "react";

export function FormInput({
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  disabled = false,
  min,
  max,
  step,
  className = "",
  helperText
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-sm border border-[#e2e8f0] bg-transparent px-5 py-3 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-800"
      />
      {helperText && (
        <p className="mt-1.5 text-xs text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

export function FormTextArea({
  label,
  required = false,
  placeholder,
  value,
  onChange,
  rows = 5,
  className = "",
  helperText
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-sm border border-[#e2e8f0] bg-transparent px-5 py-3 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors resize-none"
      />
      {helperText && (
        <p className="mt-1.5 text-xs text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

export function FormSelect({
  label,
  required = false,
  value,
  onChange,
  options = [],
  placeholder = "Select Option",
  className = ""
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          required={required}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-sm border border-[#e2e8f0] bg-transparent px-5 py-3 text-black outline-none focus:border-[#3c50e0] dark:border-[#2e3a47] dark:text-white dark:focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="" disabled className="dark:bg-[#1c2434]">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-[#1c2434]">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function FormCheckbox({
  label,
  description,
  checked,
  onChange,
  className = ""
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        {label && <span className="block text-sm font-semibold text-black dark:text-white">{label}</span>}
        {description && <span className="text-xs text-slate-400">{description}</span>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 cursor-pointer accent-[#3c50e0]"
      />
    </div>
  );
}
