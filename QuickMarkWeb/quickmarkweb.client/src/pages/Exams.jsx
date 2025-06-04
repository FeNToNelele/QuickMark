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

const gradeLabels = ["2", "3", "4", "5"];

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [questionBanks, setQuestionBanks] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);

    // ÚJ ÁLLAPOTVÁLTOZÓK A POPOVEREKHEZ
    const [isCoursePopoverOpen, setIsCoursePopoverOpen] = useState(false);
    const [isQuestionnairePopoverOpen, setIsQuestionnairePopoverOpen] = useState(false);
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
    const [isExamTypePopoverOpen, setIsExamTypePopoverOpen] = useState(false);


    console.log("Exams component rendered."); // Debug log: Komponens renderelése

    // Fetch courses and question banks on mount
    useEffect(() => {
        console.log("useEffect: Fetching initial data (courses, question banks, exams)."); // Debug log
        axios.get("/api/Course")
            .then(res => {
                console.log("Courses fetched:", res.data); // Debug log
                setCourses(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => toast("Kurzusok betöltése sikertelen!"));

        axios.get("/api/Questionnaire")
            .then(res => {
                console.log("Question banks fetched:", res.data); // Debug log
                setQuestionBanks(Array.isArray(res.data) ? res.data : [])
            })
            .catch(() => toast("Kérdésbankok betöltése sikertelen!"));

        fetchExams();
    }, []);

    const fetchExams = () => {
        console.log("fetchExams called."); // Debug log
        axios.get("/api/Exam/exams")
            .then(res => {
                console.log("Exams fetched:", res.data); // Debug log
                setExams(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => toast("Vizsgák betöltése sikertelen!"));
    };

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
        console.log("openDialog called with exam:", exam); // Debug log
        setIsEditing(!!exam);
        setCurrentExam(exam);
        if (exam) {
            let gradeThresholds = { "2": "", "3": "", "4": "", "5": "" };
            if (exam.examType === "kollokvium" && exam.correctLimit) {
                const vals = exam.correctLimit.split(";");
                gradeLabels.forEach((g, i) => (gradeThresholds[g] = vals[i] || ""));
            }

            const heldAtDate = exam.heldAt ? new Date(exam.heldAt) : "";
            console.log("Converted heldAt to Date object for form.reset:", heldAtDate, "Type:", typeof heldAtDate); // Debug log

            form.reset({
                courseId: exam.courseId,
                questionnaireId: exam.questionnaireId,
                heldAt: heldAtDate,
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
        console.log("isDialogOpen set to true."); // Debug log
    };

    const closeDialog = () => {
        console.log("closeDialog called. Setting isDialogOpen to false."); // Debug log
        setIsDialogOpen(false);
        setCurrentExam(null);
        form.reset();
        // Zárjuk be az összes popovert, ha a dialógus bezáródik
        setIsCoursePopoverOpen(false);
        setIsQuestionnairePopoverOpen(false);
        setIsDatePopoverOpen(false);
        setIsExamTypePopoverOpen(false);
    };

    // Save (add or edit)
    const handleSave = async (data) => {
        console.log("handleSave called with data:", data); // Debug log
        if (!data.courseId || !data.questionnaireId || !data.heldAt || !data.examType || !data.questionAmount) {
            toast("Minden mező kitöltése kötelező!");
            console.warn("Validation failed: Missing required fields."); // Debug log
            return;
        }
        let correctLimit = "";
        if (data.examType === "beugró") {
            if (!data.passingScore) {
                toast("Add meg a ponthatárt!");
                console.warn("Validation failed: Missing passing score for beugró."); // Debug log
                return;
            }
            correctLimit = data.passingScore;
        } else {
            // kollokvium
            correctLimit = gradeLabels.map((g) => data.gradeThresholds[g] || "").join(";");
            if (!correctLimit.split(";").every((v) => v)) {
                toast("Minden érdemjegyhez adj meg ponthatárt!");
                console.warn("Validation failed: Missing grade thresholds for kollokvium."); // Debug log
                return;
            }
        }

        const payload = {
            courseId: data.courseId,
            questionnaireId: data.questionnaireId,
            heldAt: data.heldAt, // Itt már Date objektum, a backendnek kell tudnia kezelni
            examType: data.examType,
            questionAmount: data.questionAmount,
            correctLimit,
        };
        console.log("Payload for save:", payload); // Debug log

        try {
            if (isEditing && currentExam) {
                console.log("Attempting to update exam:", currentExam.id, payload); // Debug log
                await axios.put(`/api/Exam/edit/exam/${currentExam.id}`, { id: currentExam.id, ...payload });
                toast("Vizsga módosítva!");
            } else {
                console.log("Attempting to add new exam:", payload); // Debug log
                await axios.post("/api/Exam/add/exam", payload);
                toast("Vizsga hozzáadva!");
            }
            fetchExams();
            closeDialog();
        } catch (error) {
            console.error("Mentés sikertelen!", error); // Debug log
            if (error.response) {
                console.error("Backend error response:", error.response.data, "Status:", error.response.status); // Debug log
            }
            toast("Mentés sikertelen!");
        }
    };

    // Delete exam (no endpoint, just remove locally)
    const handleDelete = (id) => {
        console.log("handleDelete called for ID:", id); // Debug log
        setExams((prev) => prev.filter((e) => e.id !== id));
        toast("Vizsga törölve!");
        // If you have a DELETE endpoint, call it here
        // await axios.delete(`/api/Exam/delete/api/Exam/${id}`);
        // fetchExams();
    };

    // Helper for displaying course/api/Questionnaire names
    const getCourseName = (code) => {
        const course = Array.isArray(courses) ? courses.find((c) => c.code === code) : undefined;
        console.log("getCourseName:", code, "->", course?.name || code); // Debug log
        return course?.name || code;
    };

    const getQuestionnaireLabel = (id) => {
        const qb = Array.isArray(questionBanks) ? questionBanks.find((q) => q.id === Number(id)) : undefined;
        console.log("getQuestionnaireLabel:", id, "->", qb?.label || id); // Debug log
        return qb?.label || id;
    };

    return (
        <div className="p-6">
            {console.log("Rendering main div of Exams component. isDialogOpen:", isDialogOpen)} {/* Debug log */}
            <h1 className="heading-primary mb-4">Vizsgák kezelése</h1>
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
                    {console.log("Rendering TableBody. Current exams array:", exams)} {/* Debug log */}
                    {(Array.isArray(exams) ? exams : []).map((exam) => {
                        console.log("Mapping exam:", exam); // Debug log
                        return (
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
                                            .map((g, i) => `${g}: ${exam.correctLimit.split(";")[i] || "-"}`)
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
                        );
                    })}
                </TableBody>
            </Table>

            {/* Add/Edit Exam Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                console.log("Dialog onOpenChange called. New open state:", open); // Debug log
                if (!open) {
                    closeDialog();
                }
                setIsDialogOpen(open);
            }}>
                <DialogContent>
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
                                        <Popover
                                            open={isCoursePopoverOpen} // KONTROLLÁLT ÁLLAPOT
                                            onOpenChange={(open) => {
                                                setIsCoursePopoverOpen(open);
                                                console.log("Popover (Course) open state:", open); // Debug log
                                            }}
                                        >
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
                                                                    onSelect={() => {
                                                                        field.onChange(course.code);
                                                                        setIsCoursePopoverOpen(false); // Bezárjuk a popovert választás után
                                                                        console.log("Course selected:", course.code); // Debug log
                                                                    }}
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
                                        <Popover
                                            open={isQuestionnairePopoverOpen} // KONTROLLÁLT ÁLLAPOT
                                            onOpenChange={(open) => {
                                                setIsQuestionnairePopoverOpen(open);
                                                console.log("Popover (Questionnaire) open state:", open); // Debug log
                                            }}
                                        >
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
                                                                    value={qb.id}
                                                                    onSelect={() => {
                                                                        field.onChange(qb.id);
                                                                        setIsQuestionnairePopoverOpen(false); // Bezárjuk a popovert választás után
                                                                        console.log("Question bank selected:", qb.id); // Debug log
                                                                    }}
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
                                        <FormLabel>Vizsga időpontja</FormLabel>
                                        <Popover
                                            open={isDatePopoverOpen} // KONTROLLÁLT ÁLLAPOT
                                            onOpenChange={(open) => {
                                                setIsDatePopoverOpen(open);
                                                console.log("Popover (Date) open state:", open); // Debug log
                                            }}
                                        >
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
                                                            format(new Date(field.value), "yyyy-MM-dd HH:mm", { locale: hu })
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
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setIsDatePopoverOpen(false); // Bezárjuk a popovert választás után
                                                        console.log("Date selected:", date); // Debug log
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date() || date > new Date("2100-01-01")
                                                    }
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
                                        <Popover
                                            open={isExamTypePopoverOpen} // KONTROLLÁLT ÁLLAPOT
                                            onOpenChange={(open) => {
                                                setIsExamTypePopoverOpen(open);
                                                console.log("Popover (Exam Type) open state:", open); // Debug log
                                            }}
                                        >
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
                                                            <CommandItem onSelect={() => {
                                                                field.onChange("beugró");
                                                                setIsExamTypePopoverOpen(false); // Bezárjuk a popovert választás után
                                                                console.log("Exam type selected: beugró"); // Debug log
                                                            }}>
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === "beugró" ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                Beugró
                                                            </CommandItem>
                                                            <CommandItem onSelect={() => {
                                                                field.onChange("kollokvium");
                                                                setIsExamTypePopoverOpen(false); // Bezárjuk a popovert választás után
                                                                console.log("Exam type selected: kollokvium"); // Debug log
                                                            }}>
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

                            {/* Number of questions */}
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
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    console.log("Question amount changed:", e.target.value); // Debug log
                                                }}
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
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        console.log("Passing score changed:", e.target.value); // Debug log
                                                    }}
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
                                                            onChange={(e) => {
                                                                field.onChange({
                                                                    ...field.value,
                                                                    [grade]: e.target.value,
                                                                });
                                                                console.log(`Grade threshold ${grade} changed:`, e.target.value); // Debug log
                                                            }}
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
                                <Button type="button" variant="outline" onClick={closeDialog}>
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
