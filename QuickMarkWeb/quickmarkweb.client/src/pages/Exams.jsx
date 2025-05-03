import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const examSchema = z.object({
  examName: z.string({ required_error: "Exam name must be at least 2 characters." }),
  courseId: z.string({ required_error: "Course ID is required." }),
  heldAt: z.date({ required_error: "Held At date is required." }),
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
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Exam Name</th>
            <th className="border px-4 py-2">Course ID</th>
            <th className="border px-4 py-2">Held At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td className="border px-4 py-2">{exam.examName}</td>
              <td className="border px-4 py-2">{exam.courseId}</td>
              <td className="border px-4 py-2">{exam.heldAt ? format(new Date(exam.heldAt), "PPP") : "N/A"}</td>              <td className="border px-4 py-2">
                <Button variant="outline" onClick={() => openDialog(exam)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(exam.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Exam" : "Add Exam"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="examName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter exam name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course ID" {...field} />
                    </FormControl>
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
                            {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
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