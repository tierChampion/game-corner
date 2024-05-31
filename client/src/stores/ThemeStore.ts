import { THEME_STORAGE_KEY } from "@/env";
import { create } from "zustand";

type Theme = "dark" | "light" | "system";

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeState>()((set) => ({
    theme: (localStorage.getItem(THEME_STORAGE_KEY) || "system") as Theme,
    setTheme: (theme: Theme) => set(() => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        return { theme: theme };
    }),
}));

export default useThemeStore;