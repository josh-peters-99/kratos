"use client"

import {
  ArrowRight,
  Plus,
  Ellipsis,
  Weight,
  PersonStanding,
  Timer,
  HeartPulse,
  Check,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { fetchExercises } from "@/lib/api/exercises";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createExercise } from "@/lib/api/exercises";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const exerciseTypeStyles = {
  weighted: {
    icon: <Weight size={18} className="text-green-800" />,
    bgColor: "bg-green-200",
  },
  bodyweight: {
    icon: <PersonStanding size={18} className="text-blue-800" />,
    bgColor: "bg-blue-200",
  },
  timed: {
    icon: <Timer size={18} className="text-yellow-800" />,
    bgColor: "bg-yellow-200",
  },
  cardio: {
    icon: <HeartPulse size={18} className="text-purple-800" />,
    bgColor: "bg-purple-200",
  },
};

const exerciseMuscleGroups = [
  "chest",
  "front deltoid",
  "lateral deltoid",
  "rear deltoid",
  "lats",
  "traps",
  "rhomboids",
  "triceps",
  "biceps",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "abdominals"
];

const ITEMS_PER_PAGE = 10;

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
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchFilterIsOpen, setSearchFilterIsOpen] = useState(false);
  const commandRef = useRef(null);

  // Filter items based on the search input
  const filteredItems = exercises.filter((exercise) => 
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectItem = (itemName) => {
    setSearch(itemName);
    setSearchFilterIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commandRef.current && !commandRef.current.contains(event.target)) {
        setSearchFilterIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    const getExercises = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data);
      } catch (err) {
        console.error(err);
      }
    };

    getExercises();
  }, [])

  const toggleMuscleGroup = (group) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  const handleAddExercise = async () => {
    const newExercise = {
      name: exerciseName,
      exerciseType: selectedType,
      muscleWorked: selectedMuscleGroups,
    };
    const saveExercise = await createExercise(newExercise);
    toast(`${saveExercise.name} saved successfully!`);
  };

  return (
    <section className="py-32 px-8 w-[800px]">
      <div className="container px-0 md:px-8">

        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="mb-10 px-4 text-3xl font-semibold md:mb-14 lg:text-4xl">
            {heading}
          </h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mb-10">
                <Plus />
                Add Exercise
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Exercise</AlertDialogTitle>

                <div className="mb-5">
                  <Label className="mb-1">Exercise Name</Label>
                  <Input type="text" placeholder="Name" onChange={(e) => setExerciseName(e.target.value)} />
                </div>

                <div className="mb-5">
                  <Label className="mb-1">Exercise Type</Label>
                  <Select onValueChange={(value) => setSelectedType(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a exercise type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        <SelectItem value="weighted">weighted</SelectItem>
                        <SelectItem value="bodyweight">bodyweight</SelectItem>
                        <SelectItem value="timed">timed</SelectItem>
                        <SelectItem value="cardio">cardio</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-5">
                  <Label className="mb-1">Target Muscle Groups</Label>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedMuscleGroups.length > 0
                          ? selectedMuscleGroups.join(", ")
                          : "Select muscle groups"}
                        <Check className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2">
                      <ScrollArea className="h-60 w-full pr-2">
                        <div className="grid gap-2">
                          {exerciseMuscleGroups.map((group) => (
                            <label
                              key={group}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedMuscleGroups.includes(group)}
                                onCheckedChange={() => toggleMuscleGroup(group)}
                              />
                              <span className="capitalize">{group}</span>
                            </label>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>

              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAddExercise}
                >
                  Save Exercise
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div ref={commandRef} className="relative mb-10">
          <Command>
            <CommandInput
              autoFocus
              placeholder="Search exercises..."
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
            {searchFilterIsOpen && (
              <CommandList>
                {filteredItems.length === 0 ? (
                  <CommandEmpty>No exercises found.</CommandEmpty>
                ) : (
                  <CommandGroup heading="Exercises">
                    {paginatedItems.map((exercise) => (
                      <CommandItem key={exercise.id} onSelect={() => handleSelectItem(exercise.name)}>{exercise.name}</CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            )}
          </Command>
        </div>

        <div className="flex flex-col">
          <Separator />
          {paginatedItems.map((exercise, index) => {
            const { icon, bgColor } = exerciseTypeStyles[exercise.exerciseType] || {
              icon: <Ellipsis size={18} />,
              bgColor: "bg-gray-200",
            };

            return (
              <div key={index}>
                <div className="flex items-center justify-between gap-4 px-4 py-5">
                  <div className="flex items-center gap-2 md:order-none">
                    <span
                      className={`flex h-14 w-16 shrink-0 items-center justify-center rounded-md ${bgColor}`}
                    >
                      {icon}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.exerciseType}
                      </p>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="outline" asChild>
                        <a className="ml-auto md:w-fit gap-2" href="#">
                          <span>View description</span>
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{exercise.name}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {exercise.description}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>


                </div>
                <Separator />
              </div>
            )
          })}
        </div>
      </div>
      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export { List2 };
