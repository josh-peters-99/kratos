"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquareMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CardioSet({ index, sets, set, onChange, onDelete }) {

  return (
    <div className="flex mb-3 items-center">

      <div className="flex flex-1 gap-3 justify-between pr-3">
        <div>
          <Label className="flex justify-center mb-1">Set</Label>
          <div className="w-[30px] md:w-[100px] flex items-center justify-center h-[38px]">
            {index + 1}
          </div>
        </div>

        <div>
          <Label className="flex justify-center mb-1">Distance</Label>
          <div className="flex gap-1">
            <Input
              value={set.distance}
              className="text-center w-[50px]"
              onChange={(e) => onChange({ ...set, distance: e.target.value })}
            />
            <Select
              value={set.units}
              onValueChange={(val) => onChange({ ...set, units: val })}
            >
              <SelectTrigger className="p-1">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miles">mi</SelectItem>
                <SelectItem value="kilometers">km</SelectItem>
                <SelectItem value="meters">m</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="flex justify-center mb-1">Duration</Label>
          <div className="flex gap-1">
            <Input
              value={set.hours}
              placeholder="h"
              className="w-full text-center"
              onChange={(e) => onChange({ ...set, hours: e.target.value })}
            />
            <Input
              value={set.minutes}
              placeholder="m"
              className="w-full text-center"
              onChange={(e) => onChange({ ...set, minutes: e.target.value })}
            />
            <Input
              value={set.seconds}
              placeholder="s"
              className="w-full text-center"
              onChange={(e) => onChange({ ...set, seconds: e.target.value })}
            />
          </div>
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