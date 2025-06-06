import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const gradeLabels = ["2", "3", "4", "5"];

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  // Fetch courses and question banks on mount
  useEffect(() => {
    axios.get("/api/Course")
      .then(res => {
        console.log("Courses loaded:", res.data);
        setCourses(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        toast("Kurzusok betöltése sikertelen!");
      });

    axios.get("/api/Questionnaire")
      .then(res => {
        console.log("Question banks loaded:", res.data);
        setQuestionBanks(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        console.error("Error loading question banks:", err);
        toast("Kérdésbankok betöltése sikertelen!");
      });

    fetchExams();
  }, []);

  const fetchExams = () => {
    axios.get("/api/Exam/exams")
      .then(res => {
        console.log("Exams loaded:", res.data);
        // Ha nem tömb, akkor üres tömböt adunk vissza
        setExams(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error loading exams:", err);
        toast("Vizsgák betöltése sikertelen!");
      });
  };

  // Form state
  const form = useForm({
    defaultValues: {
      courseId: "",
      questionnaireId: "",
      heldAt: new Date(),
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
        heldAt: new Date(exam.heldAt),
        examType: exam.examType,
        questionAmount: exam.questionAmount,
        passingScore: exam.examType === "beugró" ? exam.correctLimit : "",
        gradeThresholds,
      });
    } else {
      form.reset({
        courseId: "",
        questionnaireId: "",
        heldAt: new Date(),
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
  const handleSave = async (data) => {
    if (!data.courseId || !data.questionnaireId || !data.examType || !data.questionAmount) {
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

    const payload = {
      courseId: data.courseId,
      questionnaireId: Number(data.questionnaireId),
      heldAt: data.heldAt.toISOString(),
      examType: data.examType,
      questionAmount: Number(data.questionAmount),
      correctLimit,
    };

    console.log("Saving exam with payload:", payload);

    try {
      if (isEditing && currentExam) {
        await axios.put(`/api/Exam/${currentExam.id}`, { id: currentExam.id, ...payload });
        toast("Vizsga módosítva!");
      } else {
        await axios.post("/api/Exam", payload);
        toast("Vizsga hozzáadva!");
      }
      fetchExams();
      closeDialog();
    } catch (error) {
      console.error("Error saving exam:", error);
      toast("Mentés sikertelen: " + (error.response?.data || error.message));
    }
  };

  // Delete exam
  const handleDelete = async (id) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a vizsgát?")) {
      return;
    }
    
    try {
      await axios.delete(`/api/Exam/${id}`);
      toast("Vizsga törölve!");
      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
      setExams((prev) => prev.filter((e) => e.id !== id));
      toast("Törlés sikertelen: " + (error.response?.data || error.message));
    }
  };

  // Helper for displaying course/questionnaire names
  const getCourseName = (code) =>
    Array.isArray(courses)
      ? courses.find((c) => c.code === code)?.name || code
      : code;

  const getQuestionnaireLabel = (id) =>
    Array.isArray(questionBanks)
      ? questionBanks.find((q) => q.id === Number(id))?.label || id
      : id;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Vizsgák kezelése</h1>
      <Button onClick={() => openDialog()} className="mb-4">
        Új vizsga létrehozása
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kurzus</TableHead>
            <TableHead>Kérdésbank</TableHead>
            <TableHead>Időpont</TableHead>
            <TableHead>Típus</TableHead>
            <TableHead>Kérdések száma</TableHead>
            <TableHead>Ponthatár</TableHead>
            <TableHead>Műveletek</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(Array.isArray(exams) ? exams : []).map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{getCourseName(exam.courseId)}</TableCell>
              <TableCell>{getQuestionnaireLabel(exam.questionnaireId)}</TableCell>
              <TableCell>
                {exam.heldAt ? format(new Date(exam.heldAt), "yyyy-MM-dd HH:mm", { locale: hu }) : ""}
              </TableCell>
              <TableCell className="capitalize">{exam.examType === "beugró" ? "Beugró" : "Kollokvium"}</TableCell>
              <TableCell>{exam.questionAmount}</TableCell>
              <TableCell>
                {exam.examType === "beugró"
                  ? `Sikeres: ${exam.correctLimit} jó válasz`
                  : gradeLabels
                      .map((g, i) => `${g}: ${exam.correctLimit?.split(";")[i] || "-"}`)
                      .join(", ")}
              </TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => openDialog(exam)} className="mr-2">
                  Szerkesztés
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(exam.id)}>
                  Törlés
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {exams.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Nincsenek még vizsgák
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add/Edit Exam Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Vizsga szerkesztése" : "Új vizsga létrehozása"}</DialogTitle>
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
                    <FormLabel>Kurzus</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {getCourseName(field.value) || "Válassz kurzust"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Kurzus keresése..." />
                          <CommandList>
                            <CommandEmpty>Nincs találat</CommandEmpty>
                            <CommandGroup>
                              {courses.map((course) => (
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
                    <FormLabel>Kérdésbank</FormLabel>
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
                            <CommandEmpty>Nincs találat.</CommandEmpty>
                            <CommandGroup>
                              {questionBanks.map((qb) => (
                                <CommandItem
                                  key={qb.id}
                                  value={String(qb.id)}
                                  onSelect={() => field.onChange(qb.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      String(field.value) === String(qb.id) ? "opacity-100" : "opacity-0"
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
                    <FormLabel>Vizsga időpontja</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: hu })
                            ) : (
                              <span>Válassz dátumot</span>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Válaszd ki, mikor lesz a vizsga.
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
                    <FormLabel>Kérdések száma</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormLabel>Ponthatár</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <FormLabel>Ponthatárok</FormLabel>
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
                                  [grade]: Number(e.target.value),
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
                  Mégse
                </Button>
                <Button type="submit">{isEditing ? "Mentés" : "Létrehozás"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exams;