import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
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

const GenerateExamSheets = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [examOptions, setExamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      examId: "",
      studentCsv: null,
    },
  });

  useEffect(() => {
    axios.get("/api/Exam/exams")
      .then(res => {
        if (Array.isArray(res.data)) {
          setExamOptions(
            res.data.map((exam) => ({
              label: `${exam.id} - ${exam.examType === "beugró" ? "Entry Test" : "Final Exam"} (${new Date(exam.heldAt).toLocaleDateString()})`,
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

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("examId", data.examId);
      formData.append("studentCsv", data.studentCsv[0]);

      // Get PDF bytes from API
      const response = await axios.post("/api/Exam/generatesheets", formData, {
        responseType: 'blob',
      });

      // Create URL for the PDF blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setPdfUrl(url);
      setIsDialogOpen(true);
      toast("Exam sheets generated successfully!");
      
      // Alternatively, to automatically download:
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'exam_sheets.pdf');
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      
    } catch (error) {
      console.error("Failed to generate exam sheets:", error);
      toast("Failed to generate exam sheets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Generate Exam Sheets</h1>
      <p className="mb-6 text-muted-foreground">
        Upload a CSV file with student Neptun codes to generate exam sheets for a selected exam.
      </p>

      <div className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
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
                          <span className="sr-only">Toggle</span>
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
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Student CSV File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const files = e.target.files;
                        onChange(files?.length ? files : null);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a CSV file containing student Neptun codes in the first column.
                  </p>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Exam Sheets"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Exam Sheets Preview</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {pdfUrl && (
              <>
                <div className="h-[60vh] w-full overflow-hidden border">
                  <iframe 
                    src={pdfUrl} 
                    className="w-full h-full" 
                    title="PDF Preview"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => window.open(pdfUrl, "_blank")}>
                    Open in New Tab
                  </Button>
                  <Button onClick={() => {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.setAttribute('download', 'exam_sheets.pdf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}>
                    Download PDF
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateExamSheets;