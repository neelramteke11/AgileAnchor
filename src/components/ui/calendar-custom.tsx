
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

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
      } ${isSelected ? "bg-indigo-500 text-white" : "text-gray-400"}`}
    >
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
        {day}
      </span>
    </div>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  height?: string;
  className?: string;
  showHoverGradient?: boolean;
  hideOverflow?: boolean;
  linkTo?: string;
}

export function BentoCard({
  children,
  height = "h-auto",
  className = "",
  showHoverGradient = true,
  hideOverflow = true,
  linkTo,
}: BentoCardProps) {
  const cardContent = (
    <div
      className={`group relative flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-6 hover:bg-indigo-100/10 dark:hover:bg-indigo-900/10 ${
        hideOverflow && "overflow-hidden"
      } ${height} ${className}`}
    >
      {linkTo && (
        <div className="absolute bottom-4 right-6 z-[999] flex h-12 w-12 rotate-6 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-[-8px] group-hover:rotate-0 group-hover:opacity-100">
          <svg
            className="h-6 w-6 text-indigo-600"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.25 15.25V6.75H8.75"
            ></path>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 7L6.75 17.25"
            ></path>
          </svg>
        </div>
      )}
      {showHoverGradient && (
        <div className="user-select-none pointer-events-none absolute inset-0 z-30 bg-gradient-to-tl from-indigo-400/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>
      )}
      {children}
    </div>
  );

  if (linkTo) {
    return (
      <a
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export function Calendar() {
  const selectedDays = [4, 7, 11, 15, 20, 24, 28]; // These days will be shown as selected
  
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

  const bookingLink = `https://cal.com/aliimam/designali`;

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
    <div className="rounded-3xl border border-gray-800 bg-black p-4 shadow-lg">
      <div className="mb-2 flex justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">June, 2025</h2>
        </div>
        <p className="text-xs text-gray-400">30 min call</p>
      </div>
      <div className="grid grid-cols-7 gap-2 px-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
