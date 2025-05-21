// src/components/ui/checkbox.jsx
import React from "react";

export function Checkbox({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
      />
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
}
