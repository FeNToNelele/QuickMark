import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const examSchema = z.object({
  courseId: z.string({ required_error: "Course ID is required." }),
  questionBankId: z.string({ required_error: "Question Bank ID is required." }),
  heldAt: z.date({ required_error: "Held At date is required." }),
  examType: z.enum(["Screening Exam", "Colloquium"], {
    required_error: "Exam type is required.",
  }),
  questionCount: z.number().min(1, { message: "Question count must be at least 1." }),
  passingScore: z.number().optional(),
  gradeThresholds: z.object({
    "2": z.number().optional(),
    "3": z.number().optional(),
    "4": z.number().optional(),
    "5": z.number().optional(),
  }).optional(),
});


// FIXME Replace consts with actual data fetching logic
const courses = [
    { label: "Course 1", value: "course1" },
    { label: "Course 2", value: "course2" },
    { label: "Course 3", value: "course3" },
]

const questionbanks = [
    { label: "Question Bank 1", value: "questionbank1" },
    { label: "Question Bank 2", value: "questionbank2" },
    { label: "Question Bank 3", value: "questionbank3" },
]
const Exams = () => {
  const [exams, setExams] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  const form = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      examName: "",
      courseId: "",
      heldAt: null,
    },
  });

  const openDialog = (exam = null) => {
    setIsEditing(!!exam);
    setCurrentExam(exam);
    form.reset(exam || {});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentExam(null);
  };

  const handleSave = (data) => {
    if (isEditing) {
      setExams((prev) =>
        prev.map((exam) => (exam.id === currentExam.id ? { ...exam, ...data } : exam))
      );
    } else {
      setExams((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    closeDialog();
  };

  const handleDelete = (id) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="heading-primary">Exam Management</h1>
      <Button onClick={() => openDialog()} className="mb-4">
        Add Exam
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course ID</TableHead>
            <TableHead>Held At</TableHead>
            <TableHead>Exam Type</TableHead>
            <TableHead>Question Count</TableHead>
            <TableHead>Passing Score</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.courseId}</TableCell>
              <TableCell>
                {exam.heldAt ? format(new Date(exam.heldAt), "PPP") : "N/A"}
              </TableCell>
              <TableCell>{exam.examType}</TableCell>
              <TableCell>{exam.questionCount}</TableCell>
              <TableCell>{exam.passingScore || "N/A"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => openDialog(exam)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(exam.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Exam" : "Add Exam"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={field.value ? "true" : "false"}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? courses.find((course) => course.value === field.value)?.label
                              : "Select a course"}
                            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search courses..." />
                          <CommandList>
                            <CommandEmpty>No courses found.</CommandEmpty>
                            <CommandGroup>
                              {courses.map((course) => (
                                <CommandItem
                                  key={course.value}
                                  onSelect={() => field.onChange(course.value)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === course.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {course.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionBankId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Bank</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={field.value ? "true" : "false"}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? questionbanks.find(
                                  (bank) => bank.value === field.value
                                )?.label
                              : "Select a question bank"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search question banks..." />
                          <CommandList>
                            <CommandEmpty>No question banks found.</CommandEmpty>
                            <CommandGroup>
                              {questionbanks.map((bank) => (
                                <CommandItem
                                  key={bank.value}
                                  onSelect={() => field.onChange(bank.value)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === bank.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {bank.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heldAt"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Exam Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date("2100-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                        Select the date when the exam will be held.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={field.value ? "true" : "false"}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value || "Select exam type"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {["Screening Exam", "Colloquium"].map((type) => (
                                  <CommandItem
                                    key={type}
                                    onSelect={() => field.onChange(type)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === type ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {type}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of questions"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : "")}
                          value={field.value || ""}
                          min={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("examType") === "Screening Exam" && (
                  <FormField
                    control={form.control}
                    name="passingScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter passing score"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : "")}
                            value={field.value || ""}
                            min={0}
                            max={form.watch("questionCount") || 0}
                            step={1}
                            disabled={form.watch("examType") !== "Screening Exam"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("examType") === "Colloquium" && (
                  <FormField
                    control={form.control}
                    name="gradeThresholds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Thresholds</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {["2", "3", "4", "5"].map((grade, index) => {
                              const questionCount = form.watch("questionCount") || 0;
                              const defaultThreshold = Math.ceil(
                                questionCount * [0.5, 0.65, 0.8, 0.9][index]
                              );
                              return (
                                <div key={grade} className="flex items-center space-x-2">
                                  <span>{grade}:</span>
                                  <Input
                                    type="number"
                                    placeholder={`Score for grade ${grade}`}
                                    value={field.value?.[grade] || defaultThreshold}
                                    onChange={(e) =>
                                      field.onChange({
                                        ...field.value,
                                        [grade]: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Save Changes" : "Add Exam"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exams;