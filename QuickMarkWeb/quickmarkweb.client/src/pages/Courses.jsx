import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadSchema = z.object({
  giftFile: z
    .instanceof(File)
    .refine((file) => file.name.endsWith(".gift"), {
      message: "Only GIFT files allowed.",
    }),
});

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ coursecode: "", coursename: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const uploadForm = useForm({
    defaultValues: {
      giftFile: null
    },
    // Add validation
    resolver: zodResolver(z.object({
      giftFile: z.instanceof(File, { message: "Please select a file" })
    }))
  });

  // Fetch courses on mount
    useEffect(() => {
        const fetchCourses = () => {
            axios.get("/api/Course")
                .then(res => setCourses(res.data.map(c => ({
                    coursecode: c.code,
                    coursename: c.name
                }))))
                .catch(() => toast("Failed to load courses"));
        };
        fetchCourses();
    },[]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEdit = async () => {
    if (!formData.coursecode || !formData.coursename) {
      toast("Fill in all fields!");
      return;
    }
    try {
      if (isEditing) {
        await axios.put(`/api/Course/${formData.coursecode}`, {
          code: formData.coursecode,
          name: formData.coursename,
        });
          setCourses((prev) =>
              prev.map((course) =>
                  course.coursecode === formData.coursecode
                      ? { ...course, coursename: formData.coursename }
                      : course
          )
        );
        toast("Course updated!");
      } else {
        await axios.post("/api/Course", {
          code: formData.coursecode,
          name: formData.coursename,
        });
          setCourses((prev) =>
              [...prev,
                  {
                      coursecode: formData.coursecode,
                      coursename: formData.coursename
                  }]);
        toast("Course added!");
      }
      setIsDialogOpen(false);
      setFormData({ coursecode: "", coursename: "" });
      setIsEditing(false);
    } catch {
      toast("Failed to save course.");
    }
  };

  const handleDelete = async (coursecode) => {
      try {
          await axios.delete(`/api/Course/${coursecode}`);
            setCourses((prev) => prev.filter((course) => course.coursecode !== coursecode));
            toast("Course deleted successfully!");
        } catch (error) {
            console.error("Failed to delete course:", error);
            if (error.response && error.response.status === 404) {
                toast("Course not found.");
            } else if (error.response && error.response.status === 400) {
                toast(error.response.data || "Failed to delete course due to dependencies.");
            }
            else {
                toast("Failed to delete course.");
            }
        }
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

  const handleUpload = async (data) => {
    try {
      console.log("Form data:", data); // Debug log
      
      const formDataObj = new FormData();
      formDataObj.append("courseCode", selectedCourse.coursecode);
      formDataObj.append("giftFile", data.giftFile);
      
      console.log("FormData entries:"); // Debug log
      for (let pair of formDataObj.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post("/api/GIFT/uploadgift", formDataObj);
      toast("Question bank uploaded successfully!");
      setUploadDialogOpen(false);
      uploadForm.reset();
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
      toast("Failed to upload question bank.");
    }
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
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            uploadForm.reset();
          }
          setUploadDialogOpen(open);
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Question Bank</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Upload a GIFT file for the course: <strong>{selectedCourse?.coursename}</strong>
          </p>
          <Form {...uploadForm}>
            <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  uploadForm.handleSubmit(handleUpload)(e);
                }}
                className="space-y-4"
              >
              <FormField
                control={uploadForm.control}
                name="giftFile"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>GIFT File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".gift"
                        onChange={(e) => {
                          console.log("Selected file:", e.target.files?.[0]);
                          onChange(e.target.files?.[0]);
                        }}
                        {...field}
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