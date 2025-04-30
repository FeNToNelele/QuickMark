import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

const Courses = () => {
  const [courses, setCourses] = useState([
    { coursecode: "COURSE123", coursename: "Course 1" },
    { coursecode: "COURSE456", coursename: "Course 2" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ coursecode: "", coursename: "" });
  const [isEditing, setIsEditing] = useState(false);

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
    setFormData({ coursecode: "", coursename: ""});
    setIsEditing(false);
  };

  const handleDelete = (coursecode) => {
    setCourses((prev) => prev.filter((course) => course.coursecode !== coursecode));
  };

  const openEditDialog = (course) => {
    setFormData({ ...course});
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ coursecode: "", coursename: ""});
    setIsEditing(false);
  }

  // TODO: Implement fetching of actual examiners from the backend.
  // FIXME: Add validation to fields
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
                <Button variant="destructive" onClick={() => handleDelete(course.coursecode)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby="dialog-description" >
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
    </div>
  );
};

export default Courses;