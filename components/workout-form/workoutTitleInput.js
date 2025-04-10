"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../ui/input";

function WorkoutTitleInput({ onAutofill, setTitle, title }) {
  const [input, setInput] = useState(title || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.length > 1) {
        axios.get(`/api/workouts/search-templates?query=${input}`)
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
  }, [input]);

  const handleSelect = async (title) => {
    const confirm = window.confirm(`Use exercises from "${title}" workout?`);
    if (confirm) {
      const res = await axios.get(`/api/workouts/search-templates?query=${title}`);
      const template = res.data[0];
      onAutofill(template);
    }
    setInput(title);
    setSuggestions([]);
    setTitle(title);
  };

  const handleBlur = () => setTimeout(() => setShowSuggestions(false), 200);

  return (
    <div>
      <Input 
        type={"text"}
        id="workoutTitle"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setTitle(e.target.value);
        }}
        onBlur={handleBlur}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Workout Title"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul>
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((title, i) => (
                <li key={i} onClick={() => handleSelect(title)}>
                  {title}
                </li>
              ))}
            </ul>
          )}
        </ul>
      )}
    </div>
  )
}

export default WorkoutTitleInput;