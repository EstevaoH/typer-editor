import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Laptop, Moon, Sun, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded cursor-pointer bg-zinc-800 text-white hover:text-white hover:bg-zinc-700 relative dark:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-zinc-800 hover:text-white cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
          {theme === "light" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-zinc-800 hover:text-white cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
          {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-zinc-800 hover:text-white cursor-pointer"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>Sistema</span>
          {theme === "system" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
