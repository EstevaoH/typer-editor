"use client";

import { useSettings, FontFamily } from "@/context/settings-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import { cn } from "@/lib/utils";

export function FontSelector() {
  const { fontFamily, setFontFamily } = useSettings();

  const fonts: { value: FontFamily; label: string; className: string }[] = [
    { value: "sans", label: "Padrão (Sans)", className: "font-sans" },
    { value: "inter", label: "Inter", className: "font-inter" },
    { value: "serif", label: "Serif (Roboto)", className: "font-serif" },
    { value: "mono", label: "Mono (JetBrains)", className: "font-mono" },
  ];

  const currentFont = fonts.find((f) => f.value === fontFamily);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Type className="h-4 w-4" />
          <span className="sr-only">Mudar fonte</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => setFontFamily(font.value)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              font.value === fontFamily && "bg-accent"
            )}
          >
            <span className={font.className}>{font.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
