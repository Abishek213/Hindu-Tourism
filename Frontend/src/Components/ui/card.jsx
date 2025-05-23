// src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`border rounded shadow p-4 bg-white ${className || ''}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={`p-2 ${className || ''}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`border-b pb-2 mb-2 font-semibold ${className || ''}`}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-bold ${className || ''}`}>{children}</h3>
);
