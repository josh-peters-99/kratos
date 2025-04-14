"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquareMinus } from "lucide-react";

export default function BodyweightSet({ index, sets, set, onChange, onDelete }) {
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
          <Label className="flex justify-center mb-1">Reps</Label>
          <Input
            value={set.reps}
            className="w-full text-center"
            onChange={(e) => onChange({ ...set, reps: e.target.value })}
          />
        </div>

        <div>
          <Label className="flex justify-center mb-1">Added Weight</Label>
          <Input
            value={set.weight}
            className="w-full text-center"
            onChange={(e) => onChange({ ...set, weight: e.target.value })}
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