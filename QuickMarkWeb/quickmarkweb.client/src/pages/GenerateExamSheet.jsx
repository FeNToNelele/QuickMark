import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import jsPDF from "jspdf";
import React, { useState } from "react";
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

  const form = useForm({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      examId: "",
      studentCsv: null,
    },
  });

    // FIXME Replace with actual API endpoint

    // fetch("/api/generate-exam-sheets", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       toast("Exam sheets generated successfully!");
    //       form.reset();
    //     } else {
    //       toast("Failed to generate exam sheets.");
    //     }
    //   })
    //   .catch(() => toast("An error occurred while generating exam sheets."));
  const handleGenerate = (data) => {
    // Simulate PDF generation
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Sample Exam Sheet", 10, 10);
    doc.text(`Exam ID: ${data.examId}`, 10, 20);
    doc.text("Student List:", 10, 30);

    // Simulate reading CSV data
    const students = ["ABC123", "DEF456", "GHI789"]; // Replace with parsed CSV data
    students.forEach((student, index) => {
      doc.text(`${index + 1}. ${student}`, 10, 40 + index * 10);
    });

    // Add a QR code (optional, for demonstration)
    doc.text("QR Code Placeholder", 10, 80);

    // Save the PDF
    doc.save("exam-sheets.pdf");

    toast("Exam sheets generated successfully!");
    form.reset();
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
                              ? exams.find((exam) => exam.value === field.value)?.label
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
                              {exams.map((exam) => (
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