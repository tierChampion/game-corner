import useGlobalStore from "@/stores/GlobalStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import useThemeStore from "@/stores/ThemeStore";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Info, InfoIcon, Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

const InfoHeader: React.FC = () => {
    const { userId, roomId } = useGlobalStore();
    const { theme, setTheme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark")
                .matches ?
                "dark" : "light";

            root.classList.add(systemTheme);
        }
        else {
            root.classList.add(theme);
        }
    }, [theme]);

    return (
        <div className="w-full flex justify-end">

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button variant="ghost" size="icon">
                            <Info className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-foreground"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>{`UserId: ${userId}`}</span>
                        {roomId !== "" && <span className="block">{`RoomId: ${roomId}`}</span>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

export default InfoHeader;
