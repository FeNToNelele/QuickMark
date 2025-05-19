import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Dummy data for courses and question banks
const dummyCourses = [
  { code: "COURSE123", name: "Bevezetés a programozásba" },
  { code: "COURSE456", name: "Adatbázisok alapjai" },
];

const dummyQuestionBanks = [
  { id: 1, label: "Bevprog 2024 tavasz", courseCode: "COURSE123" },
  { id: 2, label: "Adatbázisok 2024 tavasz", courseCode: "COURSE456" },
];

// Dummy initial exams
const dummyExams = [
  {
    id: 1,
    courseId: "COURSE123",
    questionnaireId: 1,
    heldAt: "2025-06-01T10:00",
    examType: "beugró",
    questionAmount: 10,
    correctLimit: "6",
  },
  {
    id: 2,
    courseId: "COURSE456",
    questionnaireId: 2,
    heldAt: "2025-06-10T09:00",
    examType: "kollokvium",
    questionAmount: 20,
    correctLimit: "10;14;17;19", // 2:10, 3:14, 4:17, 5:19
  },
];

const gradeLabels = ["2", "3", "4", "5"];

const Exams = () => {
  const [exams, setExams] = useState(dummyExams);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  // Form state
  const form = useForm({
    defaultValues: {
      courseId: "",
      questionnaireId: "",
      heldAt: "",
      examType: "",
      questionAmount: "",
      passingScore: "",
      gradeThresholds: { "2": "", "3": "", "4": "", "5": "" },
    },
  });

  // Open dialog for add/edit
  const openDialog = (exam = null) => {
    setIsEditing(!!exam);
    setCurrentExam(exam);
    if (exam) {
      // Parse correctLimit for kollokvium
      let gradeThresholds = { "2": "", "3": "", "4": "", "5": "" };
      if (exam.examType === "kollokvium" && exam.correctLimit) {
        const vals = exam.correctLimit.split(";");
        gradeLabels.forEach((g, i) => (gradeThresholds[g] = vals[i] || ""));
      }
      form.reset({
        courseId: exam.courseId,
        questionnaireId: exam.questionnaireId,
        heldAt: exam.heldAt,
        examType: exam.examType,
        questionAmount: exam.questionAmount,
        passingScore: exam.examType === "beugró" ? exam.correctLimit : "",
        gradeThresholds,
      });
    } else {
      form.reset({
        courseId: "",
        questionnaireId: "",
        heldAt: "",
        examType: "",
        questionAmount: "",
        passingScore: "",
        gradeThresholds: { "2": "", "3": "", "4": "", "5": "" },
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentExam(null);
    form.reset();
  };

  // Save (add or edit)
  const handleSave = (data) => {
    if (!data.courseId || !data.questionnaireId || !data.heldAt || !data.examType || !data.questionAmount) {
      toast("Minden mező kitöltése kötelező!");
      return;
    }
    let correctLimit = "";
    if (data.examType === "beugró") {
      if (!data.passingScore) {
        toast("Add meg a ponthatárt!");
        return;
      }
      correctLimit = data.passingScore;
    } else {
      // kollokvium
      correctLimit = gradeLabels.map((g) => data.gradeThresholds[g] || "").join(";");
      if (!correctLimit.split(";").every((v) => v)) {
        toast("Minden érdemjegyhez adj meg ponthatárt!");
        return;
      }
    }
    const newExam = {
      id: isEditing ? currentExam.id : Date.now(),
      courseId: data.courseId,
      questionnaireId: data.questionnaireId,
      heldAt: data.heldAt,
      examType: data.examType,
      questionAmount: data.questionAmount,
      correctLimit,
    };
    if (isEditing) {
      setExams((prev) => prev.map((e) => (e.id === currentExam.id ? newExam : e)));
      toast("Vizsga módosítva!");
    } else {
      setExams((prev) => [...prev, newExam]);
      toast("Vizsga hozzáadva!");
    }
    closeDialog();
  };

  // Delete exam
  const handleDelete = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    toast("Vizsga törölve!");
  };

  // Helper for displaying course/questionnaire names
  const getCourseName = (code) => dummyCourses.find((c) => c.code === code)?.name || code;
  const getQuestionnaireLabel = (id) => dummyQuestionBanks.find((q) => q.id === Number(id))?.label || id;

  return (
    <div className="p-6">
      <h1 className="heading-primary mb-4">Vizsgák kezelése</h1>
      <Button onClick={() => openDialog()} className="mb-4">
        Új vizsga létrehozása
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Question Bank</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Number of Questions</TableHead>
            <TableHead>threshhold</TableHead>
            <TableHead>Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{getCourseName(exam.courseId)}</TableCell>
              <TableCell>{getQuestionnaireLabel(exam.questionnaireId)}</TableCell>
              <TableCell>
                {exam.heldAt ? format(new Date(exam.heldAt), "yyyy-MM-dd HH:mm") : ""}
              </TableCell>
              <TableCell className="capitalize">{exam.examType}</TableCell>
              <TableCell>{exam.questionAmount}</TableCell>
              <TableCell>
                {exam.examType === "beugró"
                  ? `Sikeres: ${exam.correctLimit} jó válasz`
                  : gradeLabels
                      .map((g, i) => `${g}: ${exam.correctLimit.split(";")[i] || "-"}`)
                      .join(", ")}
              </TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => openDialog(exam)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(exam.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Exam Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Exam" : "Create new Exam"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
              autoComplete="off"
            >
              {/* Kurzus választó */}
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
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {getCourseName(field.value) || "Choose a course"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Kurzus keresése..." />
                          <CommandList>
                            <CommandEmpty>Not found</CommandEmpty>
                            <CommandGroup>
                              {dummyCourses.map((course) => (
                                <CommandItem
                                  key={course.code}
                                  value={course.code}
                                  onSelect={() => field.onChange(course.code)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === course.code ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {course.name}
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

              {/* Kérdésbank választó */}
              <FormField
                control={form.control}
                name="questionnaireId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Bank</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {getQuestionnaireLabel(field.value) || "Válassz kérdésbankot"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Kérdésbank keresése..." />
                          <CommandList>
                            <CommandEmpty>Not found.</CommandEmpty>
                            <CommandGroup>
                              {dummyQuestionBanks.map((qb) => (
                                <CommandItem
                                  key={qb.id}
                                  value={qb.id}
                                  onSelect={() => field.onChange(qb.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === qb.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {qb.label}
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

              {/* Időpont */}
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

              {/* Vizsga típusa */}
              <FormField
                control={form.control}
                name="examType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vizsga típusa</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? field.value === "beugró"
                                ? "Beugró"
                                : "Kollokvium"
                              : "Válassz típust"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              <CommandItem onSelect={() => field.onChange("beugró")}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === "beugró" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Beugró
                              </CommandItem>
                              <CommandItem onSelect={() => field.onChange("kollokvium")}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === "kollokvium" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Kollokvium
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kérdések száma */}
              <FormField
                control={form.control}
                name="questionAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value || ""}
                        onChange={field.onChange}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ponthatár(ak) */}
              {form.watch("examType") === "beugró" && (
                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshhold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value || ""}
                          onChange={field.onChange}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("examType") === "kollokvium" && (
                <FormField
                  control={form.control}
                  name="gradeThresholds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshhold</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {gradeLabels.map((grade) => (
                          <div key={grade} className="flex items-center gap-2">
                            <span>{grade}:</span>
                            <Input
                              type="number"
                              min={1}
                              value={field.value?.[grade] || ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  [grade]: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Save" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exams;