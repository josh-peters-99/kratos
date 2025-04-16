"use client"

import { Star } from "lucide-react";
import React from "react";
import { Stats8 } from "../metrics/stats8";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CircularProgress from "../metrics/circularProgress";
import { CustomLineChart } from "../metrics/lineChart";
import { MuscleGroupsPieChart } from "../metrics/muscleGroupsPieChart";

const Hero7 = ({
  heading = "See Your Progress",
  description = "Search your exercises to see the progress you've made overtime.",
}) => {
  const progressValue = 75;

  return (
    <section className="py-24 px-3 md:px-8">
      <div className="text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl">{heading}</h1>
          <p className="text-balance text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-center lg:px-35 xl:px-50 2xl:px-75">
            <CustomLineChart />
          </div>
        </div>

        {/* <div className="w-full flex justify-center mt-10">
          <Tabs defaultValue="lifts" className="w-full">
            <TabsList>
              <TabsTrigger value="lifts">Weighted Lifts</TabsTrigger>
              <TabsTrigger value="bodyweight">Bodyweight</TabsTrigger>
              <TabsTrigger value="timed">Timed</TabsTrigger>
              <TabsTrigger value="cardio">Cardio</TabsTrigger>
            </TabsList>
            <TabsContent value="lifts" className="w-[350px]">
              <Card className="">
                <CardHeader>
                  <CardTitle>Bench Press</CardTitle>
                  <CardDescription>Progress toward your bench press goal.</CardDescription>
                </CardHeader>
                <CardContent>
                  <CircularProgress value={progressValue} />
                </CardContent>
                <CardFooter className="w-full flex justify-center">
                  <p className="border px-2 py-1 rounded-xl text-sm">185 pounds</p>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="bodyweight">Change your password here.</TabsContent>
          </Tabs>
        </div> */}
      </div>
    </section>
  );
};

export { Hero7 };

