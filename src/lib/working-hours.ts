/**
 * DRK Hospitals – Centralized Working Hours Utility
 * 
 * Provides consistent formatting for operating hours across Header, Footer,
 * Contact page, Homepage, and all public sections.
 */

export interface OperatingDayLike {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  note?: string;
  departmentNotes?: string;
}

export interface OperatingHoursSummary {
  displayShort: string;       // e.g. "Mon – Sat: 9:00 AM – 9:00 PM"
  weekdaysText: string;       // e.g. "Mon – Sat: 9:00 AM – 9:00 PM"
  sundayText: string;         // e.g. "Sunday: 9:00 AM – 9:00 PM (Consultation)" or "Sunday: Closed"
  fullWeeklySchedule: Array<{
    day: string;
    isOpen: boolean;
    hoursText: string;
    note?: string;
  }>;
}

/**
 * Standardize time string (e.g. "09:00 AM" -> "9:00 AM")
 */
function cleanTime(timeStr?: string): string {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  // Strip leading zero in 09:00 AM -> 9:00 AM
  return trimmed.replace(/^0(\d:\d\d)/, "$1");
}

/**
 * Formats a 7-day schedule into a clean, human-readable summary.
 * If Monday–Saturday have the same timings, they are automatically grouped.
 */
export function formatOperatingHours(
  days?: OperatingDayLike[]
): OperatingHoursSummary {
  if (!days || days.length === 0) {
    return {
      displayShort: "Mon – Sat: 9:00 AM – 9:00 PM",
      weekdaysText: "Mon – Sat: 9:00 AM – 9:00 PM",
      sundayText: "Sunday: 9:00 AM – 9:00 PM (Consultation)",
      fullWeeklySchedule: [],
    };
  }

  const scheduleMap = new Map<string, OperatingDayLike>();
  days.forEach((d) => scheduleMap.set(d.day.toLowerCase(), d));

  const weekDayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const weekDays = weekDayNames
    .map((name) => scheduleMap.get(name))
    .filter(Boolean) as OperatingDayLike[];

  const sunday = scheduleMap.get("sunday");

  // Format weekdays
  let weekdaysText = "";
  if (weekDays.length > 0) {
    const first = weekDays[0];
    const allSameAsFirst = weekDays.every(
      (d) =>
        d.isOpen === first.isOpen &&
        cleanTime(d.openTime) === cleanTime(first.openTime) &&
        cleanTime(d.closeTime) === cleanTime(first.closeTime)
    );

    if (allSameAsFirst) {
      if (first.isOpen) {
        weekdaysText = `Mon – Sat: ${cleanTime(first.openTime)} – ${cleanTime(first.closeTime)}`;
      } else {
        weekdaysText = "Mon – Sat: Closed";
      }
    } else {
      // Check Mon-Fri
      const monToFri = weekDays.slice(0, 5);
      const sat = weekDays[5];
      const monToFriSame = monToFri.every(
        (d) =>
          d.isOpen === first.isOpen &&
          cleanTime(d.openTime) === cleanTime(first.openTime) &&
          cleanTime(d.closeTime) === cleanTime(first.closeTime)
      );

      if (monToFriSame && first.isOpen) {
        const friText = `Mon – Fri: ${cleanTime(first.openTime)} – ${cleanTime(first.closeTime)}`;
        const satText = sat && sat.isOpen
          ? `Sat: ${cleanTime(sat.openTime)} – ${cleanTime(sat.closeTime)}`
          : "Sat: Closed";
        weekdaysText = `${friText} | ${satText}`;
      } else {
        // Individual breakdown fallback
        weekdaysText = first.isOpen
          ? `Mon – Sat: ${cleanTime(first.openTime)} – ${cleanTime(first.closeTime)}`
          : "Mon – Sat: Schedule Varies";
      }
    }
  } else {
    weekdaysText = "Mon – Sat: 9:00 AM – 9:00 PM";
  }

  // Format Sunday
  let sundayText = "";
  if (sunday) {
    if (sunday.isOpen) {
      const note = sunday.departmentNotes || sunday.note;
      const noteStr = note ? ` (${note.replace(/consultations? only/i, "Consultation").trim()})` : " (Consultation)";
      sundayText = `Sunday: ${cleanTime(sunday.openTime)} – ${cleanTime(sunday.closeTime)}${noteStr}`;
    } else {
      sundayText = "Sunday: Closed";
    }
  } else {
    sundayText = "Sunday: 9:00 AM – 9:00 PM (Consultation)";
  }

  // Build full 7-day schedule array
  const fullWeeklySchedule = days.map((d) => {
    let hoursText = "";
    if (d.isOpen) {
      hoursText = `${cleanTime(d.openTime)} – ${cleanTime(d.closeTime)}`;
    } else {
      hoursText = "Closed";
    }
    return {
      day: d.day,
      isOpen: d.isOpen,
      hoursText,
      note: d.note || d.departmentNotes,
    };
  });

  return {
    displayShort: weekdaysText,
    weekdaysText,
    sundayText,
    fullWeeklySchedule,
  };
}

