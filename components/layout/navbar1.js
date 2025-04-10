"use client"

import { 
  Book, 
  Menu, 
  Sunset, 
  Trees, 
  Zap, 
  LayoutTemplate, 
  BadgePlus, 
  NotebookPen,
  Rows3,
  ChartNoAxesCombined,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Navbar1 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Kratos.com",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Workout",
      url: "#",
      items: [
        {
          title: "New Workout",
          description: "The latest industry news, updates, and info",
          icon: <BadgePlus className="size-5 shrink-0" />,
          url: "/workout/new-workout",
        },
        {
          title: "Templates",
          description: "Our mission is to innovate and empower the world",
          icon: <LayoutTemplate className="size-5 shrink-0" />,
          url: "#",
        },
        // {
        //   title: "Feed",
        //   description: "Browse job listing and discover our workspace",
        //   icon: <Rows3 className="size-5 shrink-0" />,
        //   url: "#",
        // },
        // {
        //   title: "Statisics",
        //   description:
        //     "Get in touch with our support team or visit our community forums",
        //   icon: <ChartNoAxesCombined className="size-5 shrink-0" />,
        //   url: "/workout/stats",
        // },
      ],
    },
    {
      title: "Calendar",
      url: "#",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Pricing",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "#" },
    logout: { title: "Logout", },
    signup: { title: "Sign up", url: "#" },
  },
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuthClick = () => {
    if (session) {
      signOut();
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <section className="py-4 px-3 md:px-8">
      <div className="">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                <CircleUserRound />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-8">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <Button
                    variant="ghost"
                    className="px-2 py-1.5 text-sm"
                  >
                    <LogOut />
                    {session ? "Logout" : "Login"}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Button asChild variant="outline" size="sm">
              <a href={auth.login.url}>{auth.login.title}</a>
            </Button> */}
            {/* <Button
              variant="outline"
              onClick={handleAuthClick}
            >
              {session ? "Logout" : "Login"}
            </Button> */}
            {!session && (
              <Button asChild size="sm">
                <a href={auth.signup.url}>{auth.signup.title}</a>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {/* <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button> */}
                    <Button
                      variant="outline"
                      onClick={handleAuthClick}
                    >
                      {session ? "Logout" : "Login"}
                    </Button>
                    {!session && (
                      <Button asChild>
                        <a href={auth.signup.url}>{auth.signup.title}</a>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }) => {
  return (
    <a
      className="flex flex-row w-[350px] gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };

