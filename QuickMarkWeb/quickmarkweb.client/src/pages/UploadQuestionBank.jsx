import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const questionBankSchema = z.object({
    courseId: z.string({ required_error: "Course is required." }),
    giftFile: z
        .any()
        .refine(
            (file) => file && file[0]?.name.endsWith(".gift"),
            { message: "Only GIFT files allowed." }
        ),
});

const courses = [
  { label: "Course 1", value: "course1" },
  { label: "Course 2", value: "course2" },
  { label: "Course 3", value: "course3" },
];

const UploadQuestionBank = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(questionBankSchema),
    defaultValues: {
      courseId: "",
      giftFile: null,
    },
  });

  const handleSubmit = (data) => {
    const formData = new FormData();
    formData.append("courseId", data.courseId);
    formData.append("giftFile", data.giftFile[0]);

    // FIXME Replace with actual API endpoint
    fetch("/api/upload-question-bank", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          toast("Question bank uploaded successfully!");
          form.reset();
        } else {
          toast("Failed to upload question bank.");
        }
      })
      .catch(() => toast("An error occurred while uploading the question bank."));
  };

  return (
    <div className="p-6">
      <h1 className="heading-primary">Upload Question Bank</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        className="w-full justify-between"
                      >
                        {field.value
                          ? courses.find((course) => course.value === field.value)?.label
                          : "Select a course"}
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
            name="giftFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GIFT File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".gift"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UploadQuestionBank;