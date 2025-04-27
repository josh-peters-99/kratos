"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto min-h-screen px-6 pt-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

      <Card className="mb-8 shadow-md">
        <CardContent className="py-8">
          <p className="text-lg mb-4">
            Welcome to <span className="font-semibold">Kratos</span> — your personal companion for
            reaching new fitness milestones. 
          </p>
          <p className="text-muted-foreground mb-4">
            Our mission is simple: help you track your workouts, set powerful goals, and celebrate every achievement, big or small.
          </p>
          <p className="text-muted-foreground">
            Whether you&apos;re lifting heavy, running fast, or pushing your limits with bodyweight workouts,
            we&apos;ve built a platform to make sure every rep, every set, and every victory is recorded and recognized.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <section className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              We believe fitness is a journey, not a destination. 
              Our goal is to build the most intuitive, motivating, and customizable workout tracking experience.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold mb-4">Why We Built This</h2>
            <p className="text-muted-foreground">
              We were tired of clunky apps that made tracking a chore. 
              So we created a tool that&apos;s fast, flexible, and focused entirely on your progress — no distractions, no fluff.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* <div className="flex justify-center mt-12">
        <Button size="lg">Start Your Journey</Button>
      </div> */}
    </div>
  );
}

