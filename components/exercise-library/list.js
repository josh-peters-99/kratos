import {
  ArrowRight,
  Award,
  Building2,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Trophy,
  Plus,
  Ellipsis,
  ChevronDown,
  ChevronUp,
  Weight,
  PersonStanding,
  Timer,
  HeartPulse,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const List2 = ({
  heading = "Exercise Library",
  items = [
    {
      icon: <Weight />,
      title: "Bench Press",
      category: "Weighted",
      description: "Outstanding Performance Award.",
      link: "#",
    },
    {
      icon: <Weight />,
      title: "Back Squats",
      category: "Weighted",
      description: "Best in Category Winner.",
      link: "#",
    },
    {
      icon: <HeartPulse />,
      title: "Running",
      category: "Cardio",
      description: "Breakthrough Solution of the Year.",
      link: "#",
    },
    {
      icon: <PersonStanding />,
      title: "Pull-ups",
      category: "Bodyweight",
      description: "Top-Rated Solution Provider.",
      link: "#",
    },
    {
      icon: <Weight />,
      title: "Iso-lateral Row",
      category: "Weighted",
      description: "Executive Team of the Year.",
      link: "#",
    },
    {
      icon: <Timer />,
      title: "Planks",
      category: "Timed",
      description: "Green Initiative Excellence.",
      link: "#",
    },
  ],
}) => {
  return (
    <section className="py-32 w-[800px]">
      <div className="container px-0 md:px-8">
        <h1 className="mb-10 px-4 text-3xl font-semibold md:mb-14 md:text-4xl">
          {heading}
        </h1>
        <div className="flex flex-col">
          <Separator />
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex items-center gap-4 px-4 py-5">
                <div className="flex items-center gap-2 md:order-none">
                  <span className="flex h-14 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                    {item.icon}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </div>
                {/* <p className="order-1 text-2xl font-semibold md:order-none md:col-span-2">
                  {item.description}
                </p> */}
                <Button variant="outline" asChild>
                  <a
                    className="ml-auto w-fit gap-2"
                    href={item.link}
                  >
                    <span>View description</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { List2 };
