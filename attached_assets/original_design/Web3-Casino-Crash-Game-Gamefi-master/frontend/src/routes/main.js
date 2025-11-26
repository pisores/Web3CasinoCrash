import { useRoutes } from "react-router-dom";
import MainRoutes from "./mainRoutes";

export default function ThemeRoutes() {
    return useRoutes(MainRoutes);
}