"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

function ExerciseNameInput({ value, onSetType, onNameChange }) {
  const [name, setName] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (name.length > 1) {
        axios.get(`/api/exercises/search-name?query=${name}`)
          .then(res => {
            setSuggestions(res.data);
            setShowSuggestions(true);
          });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [name]);

  const handleSelect = (exercise) => {
    setName(exercise.name);
    onSetType(exercise.exerciseType);
    onNameChange(exercise.name);
    setIsTyping(false) // stop dropdown from reappearing
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setIsTyping(false); // make sure it's reset
    }, 200);
  }

  return (
    <div className="w-full relative">
      <div className="flex">
        <div>
          <Input
            type={"text"}
            id="exerciseName"
            autoComplete="off"
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
              setName(newValue);
              onNameChange(newValue);
              setIsTyping(true);
            }}
            onBlur={handleBlur}
            placeholder="Exercise Name"
            className="mr-5"
          />
        </div>
      </div>

      {isTyping && showSuggestions && (
        <Command className="absolute z-10">
          <CommandList>
            {suggestions.length > 0 ? (
              <CommandGroup heading="Suggestions">
                {suggestions.map((exercise, index) => (
                  <CommandItem 
                    key={index}
                    onSelect={() => handleSelect(exercise)}
                    className="cursor-pointer"
                  >
                    {exercise.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      )}

    </div>
  )
}

export default ExerciseNameInput;