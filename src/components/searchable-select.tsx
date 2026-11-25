// src/components/ui/searchable-select.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
  keywords?: string;
};

type SearchableSelectProps = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  required?: boolean;
  allowClear?: boolean;
  allowCustom?: boolean;
  variant?: "box" | "underline";
  className?: string;
};

type DropdownCoords = {
  top: number;
  bottom: number;
  left: number;
  width: number;
  openUpward: boolean;
};

export function SearchableSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Ketik atau pilih…",
  emptyText = "Pilihan tidak ditemukan",
  disabled = false,
  required = false,
  allowClear = true,
  allowCustom = false,
  variant = "box",
  className = "",
}: SearchableSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value],
  );

  const displayLabel = selectedOption
    ? selectedOption.label
    : allowCustom && value
      ? value
      : "";

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => {
      const target = [opt.label, opt.sublabel, opt.keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return target.includes(q);
    });
  }, [options, query]);

  const computeCoords = useCallback((): DropdownCoords | null => {
    if (!wrapperRef.current) return null;
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < 230 && rect.top > 230;
    return {
      top: rect.bottom + 4,
      bottom: window.innerHeight - rect.top + 4,
      left: rect.left,
      width: rect.width,
      openUpward,
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleScrollOrResize(e: Event) {
      if (listRef.current && e.target === listRef.current) return;
      const next = computeCoords();
      if (next) setCoords(next);
    }

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, computeCoords]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideInput = containerRef.current?.contains(target);
      const insideList = listRef.current?.contains(target);

      if (!insideInput && !insideList) {
        if (open && allowCustom && query.trim()) {
          onChange(query.trim());
        }
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, allowCustom, query, onChange]);

  function scrollOptionIntoView(index: number) {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    if (!item) return;

    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    if (itemTop < list.scrollTop) {
      list.scrollTop = itemTop;
    } else if (itemBottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = itemBottom - list.clientHeight;
    }
  }

  function openDropdown() {
    if (disabled) return;
    const nextCoords = computeCoords();
    if (nextCoords) setCoords(nextCoords);
    setQuery("");
    setHighlightIndex(0);
    setOpen(true);
  }

  function selectOption(opt: SelectOption) {
    onChange(opt.value);
    setQuery("");
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    const nextCoords = computeCoords();
    if (nextCoords) setCoords(nextCoords);
    setQuery("");
    setHighlightIndex(0);
    setOpen(true);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredOptions.length === 0) return;
      const next = (highlightIndex + 1) % filteredOptions.length;
      setHighlightIndex(next);
      scrollOptionIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredOptions.length === 0) return;
      const prev =
        (highlightIndex - 1 + filteredOptions.length) % filteredOptions.length;
      setHighlightIndex(prev);
      scrollOptionIntoView(prev);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightIndex]) {
        selectOption(filteredOptions[highlightIndex]);
      } else if (allowCustom && query.trim()) {
        onChange(query.trim());
        setQuery("");
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setQuery("");
      setOpen(false);
    } else if (e.key === "Tab") {
      if (allowCustom && query.trim()) {
        onChange(query.trim());
      }
      setQuery("");
      setOpen(false);
    }
  }

  const baseInputClass =
    variant === "underline"
      ? "w-full border-b border-slate-200 bg-transparent pr-11 pb-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400"
      : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-14 text-sm text-slate-800 placeholder:text-slate-400 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  const dropdownMenu =
    open && !disabled && coords && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={listRef}
            role="listbox"
            style={{
              position: "fixed",
              left: coords.left,
              width: coords.width,
              ...(coords.openUpward
                ? { bottom: coords.bottom }
                : { top: coords.top }),
            }}
            className="z-[9999] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-2xl"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2.5 text-center text-xs text-slate-400">
                {emptyText}
              </li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightIndex;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectOption(opt);
                    }}
                    className={
                      "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm transition-colors " +
                      (isHighlighted
                        ? "bg-indigo-50 text-indigo-700"
                        : isSelected
                          ? "bg-slate-50 font-medium text-slate-900"
                          : "text-slate-700 hover:bg-slate-50")
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate">{opt.label}</p>
                      {opt.sublabel && (
                        <p className="truncate text-[11px] text-slate-400">
                          {opt.sublabel}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                    )}
                  </li>
                );
              })
            )}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}

      <div ref={wrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          value={open ? query : displayLabel}
          placeholder={open && displayLabel ? displayLabel : placeholder}
          onFocus={openDropdown}
          onClick={() => {
            if (!open) openDropdown();
          }}
          onChange={(e) => {
            if (!open) {
              const nextCoords = computeCoords();
              if (nextCoords) setCoords(nextCoords);
              setOpen(true);
            }
            setQuery(e.target.value);
            setHighlightIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className={
            baseInputClass +
            (open && displayLabel ? " placeholder:text-slate-700" : "")
          }
        />

        <div
          className={
            "absolute inset-y-0 right-0 flex items-center gap-0.5 " +
            (variant === "underline" ? "pb-1.5" : "pr-2")
          }
        >
          {!disabled && allowClear && value !== "" && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              aria-label="Hapus pilihan"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => {
              if (open) {
                setQuery("");
                setOpen(false);
              } else {
                inputRef.current?.focus();
                openDropdown();
              }
            }}
            aria-label="Buka daftar pilihan"
            className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:pointer-events-none"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-150 ${
                open ? "rotate-180 text-indigo-600" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {dropdownMenu}
    </div>
  );
}
