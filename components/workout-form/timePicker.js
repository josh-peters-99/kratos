"use client"

import { Input } from "../ui/input"
import { Label } from "../ui/label"

export function TimePicker({ time, setTime }) {
  const handleTimeChange = (event) => {
    setTime(event.target.value)
  }

  return (
    <div>
      <Label htmlFor="time-picker">
        Pick a time:
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id="time-picker"
          type="time"
          value={time || ""}
          onChange={handleTimeChange}
          className="text-muted-foreground"
        />
      </div>
    </div>
  )
}
