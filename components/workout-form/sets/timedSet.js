"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquareMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TimedSet({ index, sets, set, onChange, onDelete }) {

  return (
    <div className="flex justify-between mb-3 items-center">

      <div className="flex flex-1 gap-3 justify-between pr-3">
        <div>
          <Label className="flex justify-center mb-1">Set</Label>
          <div className="w-[75px] md:w-[100px] flex items-center justify-center h-[38px]">
            {index + 1}
          </div>
        </div>

        <div>
          <Label className="flex justify-center mb-1">Hours</Label>
          <Input
            value={set.hours}
            className="w-full text-center"
            onChange={(e) => onChange({ ...set, hours: e.target.value })}
          />
        </div>

        <div>
          <Label className="flex justify-center mb-1">Minutes</Label>
          <Input
            value={set.minutes}
            className="w-full text-center"
            onChange={(e) => onChange({ ...set, minutes: e.target.value })}
          />
        </div>

        <div>
          <Label className="flex justify-center mb-1">Seconds</Label>
          <Input
            value={set.seconds}
            className="w-full text-center"
            onChange={(e) => onChange({ ...set, seconds: e.target.value })}
          />
        </div>

      </div>


      <div className="flex items-center h-[38px] self-end">
        <Button type="button" onClick={onDelete} variant="ghost" className="text-red-500 p-2 h-auto hover:text-red-600">
          <SquareMinus />
        </Button>
      </div>

    </div>
  )
}