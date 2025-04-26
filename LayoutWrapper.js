"use client"

import { usePathname } from "next/navigation";
import { Navbar1 } from "./components/layout/navbar1";
import { Footer7 } from "./components/layout/footer";
import { Toaster } from "@/components/ui/sonner"

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    // List of routes where navbar/footer should be hidden
    const hideLayoutPaths = ["/auth/login", "/auth/signup"];

    const shouldHideLayout = hideLayoutPaths.includes(pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {!shouldHideLayout && <Navbar1 />}
            <main className="flex-1">{children}</main>
            <Toaster />
            {!shouldHideLayout && <Footer7 />}
        </div>
    )
}