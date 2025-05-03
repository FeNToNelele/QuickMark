import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadSchema = z.object({
  giftFile: z
    .any()
    .refine(
      (file) => file && file[0]?.name.endsWith(".gift"),
      { message: "Only GIFT files allowed." }
  ),
});

const Courses = () => {
  const [courses, setCourses] = useState([
    { coursecode: "COURSE123", coursename: "Course 1" },
    { coursecode: "COURSE456", coursename: "Course 2" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ coursecode: "", coursename: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const uploadForm = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      giftFile: null,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEdit = () => {
    if (isEditing) {
      setCourses((prev) =>
        prev.map((course) =>
          course.coursecode === formData.coursecode ? { ...course, coursename: formData.coursename } : course
        )
      );
    } else {
      setCourses((prev) => [...prev, { coursecode: formData.coursecode, coursename: formData.coursename }]);
    }
    setIsDialogOpen(false);
    setFormData({ coursecode: "", coursename: "" });
    setIsEditing(false);
  };

  const handleDelete = (coursecode) => {
    setCourses((prev) => prev.filter((course) => course.coursecode !== coursecode));
  };

  const openEditDialog = (course) => {
    setFormData({ ...course });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ coursecode: "", coursename: "" });
    setIsEditing(false);
  };

  const openUploadDialog = (course) => {
    setSelectedCourse(course);
    setUploadDialogOpen(true);
  };

  const handleUpload = (data) => {
    const formData = new FormData();
    formData.append("coursecode", selectedCourse.coursecode);
    formData.append("giftFile", data.giftFile[0]);

    // FIXME Replace with actual API endpoint
  
    // fetch("/api/upload-question-bank", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       toast("Question bank uploaded successfully!");
    //       setUploadDialogOpen(false);
    //       uploadForm.reset();
    //     } else {
    //       toast("Failed to upload question bank.");
    //     }
    //   })
    //   .catch(() => toast("An error occurred while uploading the question bank."));
    toast("Question bank uploaded successfully!");
    setUploadDialogOpen(false);
    uploadForm.reset();
  
  };

  return (
    <div className="p-6">
      <h1 className="heading-primary">Course Management</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        Add Course
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Code</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.coursecode}>
              <TableCell>{course.coursecode}</TableCell>
              <TableCell>{course.coursename}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => openEditDialog(course)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(course.coursecode)} className="mr-2">
                  Delete
                </Button>
                <Button variant="default" onClick={() => openUploadDialog(course)}>
                  Upload Question Bank
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Course Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Course" : "Add Course"}</DialogTitle>
          </DialogHeader>
          <p id="dialog-description" className="text-sm text-muted-foreground">
            {isEditing
              ? "Edit the details of the selected course."
              : "Fill in the details to add a new course."}
          </p>
          <div className="space-y-4">
            <Input
              name="coursecode"
              placeholder="Course Code"
              value={formData.coursecode}
              onChange={handleInputChange}
              disabled={isEditing}
            />
            <Input
              name="coursename"
              placeholder="Course Name"
              value={formData.coursename}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog()}>
              Cancel
            </Button>
            <Button onClick={handleAddOrEdit}>{isEditing ? "Save Changes" : "Add Course"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Question Bank Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Question Bank</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Upload a GIFT file for the course: <strong>{selectedCourse?.coursename}</strong>
          </p>
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(handleUpload)} className="space-y-4">
              <FormField
                control={uploadForm.control}
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;