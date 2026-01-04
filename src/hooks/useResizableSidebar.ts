import { useState, useEffect, useCallback, useRef } from "react";

const SIDEBAR_WIDTH_STORAGE_KEY = "sidebar_custom_width";
const MIN_WIDTH = 256; // 16rem (w-64)
const MAX_WIDTH = 512; // 32rem (w-128)
const DEFAULT_WIDTH = 320; // 20rem (w-80)

export function useResizableSidebar(isCollapsed: boolean) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Carregar largura salva do localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  // Salvar largura no localStorage
  const saveWidth = useCallback((width: number) => {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, width.toString());
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    let currentWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      currentWidth = clampedWidth;
      setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      saveWidth(currentWidth);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, sidebarWidth, saveWidth]);

  // Salvar quando a largura mudar (debounced)
  useEffect(() => {
    if (!isResizing && sidebarWidth !== DEFAULT_WIDTH) {
      const timer = setTimeout(() => {
        saveWidth(sidebarWidth);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sidebarWidth, isResizing, saveWidth]);

  return {
    sidebarWidth,
    isResizing,
    sidebarRef,
    handleMouseDown,
    sidebarWidthPx: `${sidebarWidth}px`,
  };
}

