"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ date, setDate }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (date) {
      setFormattedDate(format(date, "PPP"));
    }
  }, [date]);

  return (
    <div>
      <Label>Workout Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] md:w-[240px] justify-start text-left font-normal mt-1",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date ? formattedDate || "..." : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

