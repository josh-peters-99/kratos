"use client"

import { usePathname } from "next/navigation";
import { Navbar1 } from "./components/layout/navbar1";
import { Footer7 } from "./components/layout/footer";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    // List of routes where navbar/footer should be hidden
    const hideLayoutPaths = ["/auth/login", "/auth/signup"];

    const shouldHideLayout = hideLayoutPaths.includes(pathname);

    return (
        <>
            {!shouldHideLayout && <Navbar1 />}
            <main>{children}</main>
            {!shouldHideLayout && <Footer7 />}
        </>
    )
}