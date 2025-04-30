import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

const Examiners = () => {
  const [examiners, setExaminers] = useState([
    { neptun: "ABC123", fullName: "John Doe" },
    { neptun: "DEF456", fullName: "Jane Smith" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ neptun: "", fullName: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEdit = () => {
    if (isEditing) {
      setExaminers((prev) =>
        prev.map((examiner) =>
          examiner.neptun === formData.neptun ? { ...examiner, fullName: formData.fullName } : examiner
        )
      );
    } else {
      setExaminers((prev) => [...prev, { neptun: formData.neptun, fullName: formData.fullName }]);
    }
    setIsDialogOpen(false);
    setFormData({ neptun: "", fullName: "", password: "" });
    setIsEditing(false);
  };

  const handleDelete = (neptun) => {
    setExaminers((prev) => prev.filter((examiner) => examiner.neptun !== neptun));
  };

  const openEditDialog = (examiner) => {
    setFormData({ ...examiner, password: "" });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ neptun: "", fullName: "", password: "" });
    setIsEditing(false);
  }

  // TODO: Implement fetching of actual examiners from the backend.
  // FIXME: Add validation to fields
  return (
    <div className="p-6">
      <h1 className="heading-primary">Examiners Management</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        Add Examiner
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Neptun Code</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {examiners.map((examiner) => (
            <TableRow key={examiner.neptun}>
              <TableCell>{examiner.neptun}</TableCell>
              <TableCell>{examiner.fullName}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => openEditDialog(examiner)} className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(examiner.neptun)}>
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
            <DialogTitle>{isEditing ? "Edit Examiner" : "Add Examiner"}</DialogTitle>
          </DialogHeader>
          <p id="dialog-description" className="text-sm text-muted-foreground">
            {isEditing
              ? "Edit the details of the selected examiner."
              : "Fill in the details to add a new examiner."}
          </p>
          <div className="space-y-4">
            <Input
              name="neptun"
              placeholder="Neptun Code"
              value={formData.neptun}
              onChange={handleInputChange}
              disabled={isEditing}
            />
            <Input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {!isEditing && (
              <Input
                name="password"
                type="password"
                placeholder="Initial Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog()}>
              Cancel
            </Button>
            <Button onClick={handleAddOrEdit}>{isEditing ? "Save Changes" : "Add Examiner"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Examiners;