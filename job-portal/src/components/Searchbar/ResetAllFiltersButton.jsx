import { useState } from "react";
import FilterDropdown from "./FilterDropdown";

/**
 * ResetAllFiltersButton
 * A standalone button that resets every FilterDropdown in your filter bar
 * back to its default (empty) selection.
 *
 * How it works: FilterDropdown manages its own selection state internally,
 * so the simplest way to reset every dropdown from outside, without
 * editing FilterDropdown itself, is to remount them. This component does
 * that by bumping a `resetKey` value and passing it down as part of each
 * dropdown's `key` prop. When the key changes, React unmounts and
 * remounts the dropdowns, which clears their internal state.
 *
 * Usage:
 *   const [resetKey, setResetKey] = useState(0);
 *   ...
 *   <FilterDropdown key={`remote-${resetKey}`} label="Remote" options={...} />
 *   <FilterDropdown key={`skill-${resetKey}`} label="Developer skill" options={...} />
 *   <ResetAllFiltersButton onReset={() => setResetKey((k) => k + 1)} />
 */
export function ResetAllFiltersButton({ onReset, label = "Reset all filters", disabled = false }) {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        disabled
          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}