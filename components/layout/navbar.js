"use client"

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Moon, Sun, CircleUserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
  
const components = [
    {
      title: "Log New Workout",
      href: "/docs/primitives/alert-dialog",
      description:
        "Log a new workout starting from scratch.",
    },
    {
      title: "Create Workout Template",
      href: "/docs/primitives/hover-card",
      description:
        "Create a personalized and reusable workout template.",
    },
    {
      title: "Plan Weekly Workouts",
      href: "/docs/primitives/progress",
      description:
        "Plan ahead and schedule your workouts for the week.",
    },
  ]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();

    // Ensure component is mounted before accessing session to prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = () => {
        setMenuOpen((prev) => {
            const newState = !prev;
            document.body.style.overflow = newState ? "hidden" : "auto";
            document.body.style.width = newState ? "100vw" : "auto"; // Prevent sideways scrolling
            return newState;
        });
    };

    return (
        <nav className="flex w-full justify-between">
            <div>
                <Link href="/">KRATOS</Link>
            </div>

            <NavigationMenu>
                <NavigationMenuList>

                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/"
                            className={navigationMenuTriggerStyle()}
                        >
                            Dashboard
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                    <NavigationMenuTrigger className="cursor-pointer">Workouts</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                            {components.map((component) => (
                                <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                                >
                                {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/"
                            className={navigationMenuTriggerStyle()}
                        >
                            Calendar
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href="/"
                            className={navigationMenuTriggerStyle()}
                        >
                            About
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                        <CircleUserRound className="h-[1.2rem] w-[1.2rem]" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                        Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                        Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                        System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </nav>
    );
}

const ListItem = React.forwardRef(({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </NavigationMenuLink>
      </li>
    )
  })
  
  
  ListItem.displayName = "ListItem"