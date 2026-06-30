import { useState, useRef, useEffect } from "react";

export function ChevronDownIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * FilterDropdown
 * A reusable filter button + dropdown panel, similar to job-board filters
 * (e.g. "Remote", "Developer skill"). Multi-select only, with checkboxes
 * indicating that more than one option can be chosen.
 *
 * Props:
 * - label: string                 Button text, e.g. "Developer skill"
 * - options: string[]             List of option labels
 * - defaultSelected: string[]     Initially selected option(s)
 * - onChange: (selected: string[]) => void   Fires whenever selection changes
 */
export default function FilterDropdown({
  label,
  options = [],
  defaultSelected = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultSelected);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function toggleOption(option) {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    setSelected(next);
    onChange?.(next);
  }

  function handleReset() {
    setSelected([]);
    onChange?.([]);
  }

  const hasSelection = selected.length > 0;

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors
          ${
            open
              ? "border-blue-600 text-blue-700 bg-blue-50"
              : "border-gray-300 text-gray-800 bg-white hover:border-gray-400"
          }`}
      >
        <span>{label}</span>
        {hasSelection && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
            {selected.length}
          </span>
        )}
        <ChevronDownIcon
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <ul className="max-h-64 overflow-y-auto py-2">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleOption(option)}
                    className="mx-2 my-0.5 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors
                        ${
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 bg-white"
                        }`}
                    >
                      {isSelected && <CheckIcon className="text-white" />}
                    </span>
                    <span className={isSelected ? "text-blue-700" : ""}>{option}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer: Reset only */}
          <div className="flex justify-end border-t border-gray-100 px-3 py-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasSelection}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors
                ${
                  hasSelection
                    ? "text-blue-700 hover:bg-blue-50"
                    : "cursor-not-allowed text-gray-300"
                }`}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}