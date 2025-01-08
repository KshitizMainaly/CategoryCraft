import { useEffect, useRef, useState } from "react";
import { GiCrossedBones } from "react-icons/gi";
import { MdDarkMode } from "react-icons/md";
import { AiOutlineSun } from "react-icons/ai";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export function Select({ multiple, value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (!value.find((v) => v.value === option.value)) {
        // Prevent duplicate selections
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple
      ? value.some((v) => v.value === option.value)
      : option === value;
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex justify-around mt-4">
      <div
        ref={containerRef}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        className="  lg:w-[700px] md:w-[400px]  w-[300px]  relative  bg-purple-100 m-h-[1.5em] border border-gray-800 flex items-center gap-[0.5em] p-[0.5em] border-r-[0.25em] outline-none"
      >
        <span className="flex-grow flex gap-[.5em] flex-wrap w-full">
          {multiple
            ? value.map((v) => (
                <button
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter((o) => o !== v));
                  }}
                  className="btn btn-outline btn-success flex min-w-[190px] items-center border boder-r-[.25em] p-[.25em] gap-[.25em] cursor-pointer bg-none outline-none"
                >
                  {v.label}
                  <span className="btn btn-xs lg:btn-xs btn-outline btn-error ml-4">
                    <GiCrossedBones />
                  </span>
                </button>
              ))
            : value?.label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
          className="btn btn-ghost btn-outline"
        >
          <GiCrossedBones />
        </button>
        <ul
          className={`absolute top-[100%] left-0 right-0 max-h-60 overflow-y-auto bg-white shadow-md z-10 border border-gray-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={option.value}
              className={`cursor-pointer px-4 py-2 ${
                isOptionSelected(option) ? "bg-gray-300" : ""
              } ${
                index === highlightedIndex ? "bg-blue-200" : ""
              } hover:bg-blue-300`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleToggleTheme}
        className="btn btn-outline btn-secondary"
      >
        {theme === "light" ? <AiOutlineSun /> : <MdDarkMode />}
      </button>
    </div>
  );
}
