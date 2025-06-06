
"use client";

import React from "react";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarDay: React.FC<{ day: number | string; isHeader?: boolean; isSelected?: boolean }> = ({
  day,
  isHeader,
  isSelected,
}) => {
  return (
    <div
      className={`col-span-1 row-span-1 flex h-10 w-10 items-center justify-center ${
        isHeader ? "" : "rounded-full"
      } ${isSelected ? "bg-indigo-500 text-white" : isHeader ? "text-gray-300" : "text-white hover:bg-gray-700"}`}
    >
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
        {day}
      </span>
    </div>
  );
};

export function Calendar() {
  const selectedDays = [4, 7, 11, 15, 20, 24, 28];
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const renderCalendarDays = () => {
    let days: React.ReactNode[] = [
      ...dayNames.map((day, i) => (
        <CalendarDay key={`header-${day}`} day={day} isHeader />
      )),
      ...Array(firstDayOfWeek).map((_, i) => (
        <div
          key={`empty-start-${i}`}
          className="col-span-1 row-span-1 h-10 w-10"
        />
      )),
      ...Array(daysInMonth)
        .fill(null)
        .map((_, i) => (
          <CalendarDay 
            key={`date-${i + 1}`} 
            day={i + 1} 
            isSelected={selectedDays.includes(i + 1)}
          />
        )),
    ];

    return days;
  };

  return (
    <div className="rounded-3xl border border-gray-800 bg-gray-900 p-4 shadow-lg">
      <div className="mb-2 flex justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">{currentMonth}, {currentYear}</h2>
        </div>
        <p className="text-xs text-gray-400">Tasks scheduled</p>
      </div>
      <div className="grid grid-cols-7 gap-2 px-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
