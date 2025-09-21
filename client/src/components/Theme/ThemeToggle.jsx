import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 cursor-pointer rounded-full transition-colors duration-300 
                  bg-base-content/10 "
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      <span className="text-lg">
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
