// src/components/ui/calendar.jsx
import * as React from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export function Calendar({ value, onChange }) {
  return (
    <div className="rounded-md border p-2">
      <ReactCalendar onChange={onChange} value={value} />
    </div>
  );
}
