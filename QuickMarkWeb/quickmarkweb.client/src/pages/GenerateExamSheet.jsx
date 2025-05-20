import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const generateExamSchema = z.object({
  examId: z.string({ required_error: "Exam is required." }),
  studentCsv: z
    .any()
    .refine(
      (file) => file && file[0]?.name.endsWith(".csv"),
      { message: "Only CSV files are allowed." }
    ),
});

const exams = [
  { label: "Exam 1", value: "exam1" },
  { label: "Exam 2", value: "exam2" },
  { label: "Exam 3", value: "exam3" },
];

const GenerateExamSheets = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [examOptions, setExamOptions] = useState([]);

  const form = useForm({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      examId: "",
      studentCsv: null,
    },
  });

  useEffect(() => {
    axios.get("/Exam/exams")
      .then(res => {
        if (Array.isArray(res.data)) {
          setExamOptions(
            res.data.map((exam) => ({
              label: `${exam.id} - ${exam.examType === "beugró" ? "Entry Test" : "Final Exam"} (${exam.heldAt?.slice(0, 10)})`,
              value: String(exam.id),
            }))
          );
        }
      })
      .catch(() => toast("Failed to load exams."));
  }, []);

  const handleGenerate = async (data) => {
    if (!data.examId || !data.studentCsv) {
      toast("Please select an exam and upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("studentCsv", data.studentCsv[0]);

    try {
      // First, get the exam details (needed for backend)
      const examRes = await axios.get(`/Exam/exam/${data.examId}/generatesheets`);
      const examDetails = examRes.data;

      // Prepare request payload
      const payload = {
        ...examDetails,
        // You may need to adjust this depending on backend expectations
        // For now, we send the CSV file as a separate field
      };

      // Send the request to generate the PDF
      // If your backend expects multipart/form-data with the CSV, use formData
      // If it expects JSON + CSV, you may need to adjust backend or send both
      // Here, let's assume you POST to /Exam/exam/{id}/generatesheets with the CSV as form-data

      formData.append("examData", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      const response = await axios.post(
        `/Exam/exam/${data.examId}/generatesheets`,
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Download the PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exam-sheets.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast("Exam sheets generated successfully!");
      form.reset();
      setIsDialogOpen(false);
    } catch (err) {
      toast("Failed to generate exam sheets.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="heading-primary">Generate Exam Sheets</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        Generate Exam Sheets
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Exam Sheets</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-4">
              <FormField
                control={form.control}
                name="examId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Exam</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={field.value ? "true" : "false"}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? examOptions.find((exam) => exam.value === field.value)?.label
                              : "Select an exam"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search exams..." />
                          <CommandList>
                            <CommandEmpty>No exams found.</CommandEmpty>
                            <CommandGroup>
                              {examOptions.map((exam) => (
                                <CommandItem
                                  key={exam.value}
                                  onSelect={() => field.onChange(exam.value)}
                                >
                                  {exam.label}
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
                name="studentCsv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Student CSV</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateExamSheets;