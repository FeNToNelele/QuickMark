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

const examinerSchema = z.object({
  neptun: z
    .string()
    .min(6, { message: "Neptun code must be 6 characters long." })
    .max(6, { message: "Neptun code must be 6 characters long." }),
  fullName: z.string().min(1, { message: "Full name is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).optional(),
});

const Examiners = () => {
  const [examiners, setExaminers] = useState([
    { neptun: "ABC123", fullName: "John Doe" },
    { neptun: "DEF456", fullName: "Jane Smith" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExaminer, setSelectedExaminer] = useState(null);

  const form = useForm({
    resolver: zodResolver(examinerSchema),
    defaultValues: {
      neptun: "",
      fullName: "",
      password: "",
    },
  });

  const openDialog = (examiner = null) => {
    setIsEditing(!!examiner);
    setSelectedExaminer(examiner);
    form.reset(examiner || {});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedExaminer(null);
    form.reset();
  };

  const handleSave = (data) => {
    if (isEditing) {
      setExaminers((prev) =>
        prev.map((examiner) =>
          examiner.neptun === selectedExaminer.neptun ? { ...examiner, ...data } : examiner
        )
      );
      toast("Examiner updated successfully!");
    } else {
      setExaminers((prev) => [...prev, data]);
      toast("Examiner added successfully!");
    }
    closeDialog();
  };

  const handleDelete = (neptun) => {
    setExaminers((prev) => prev.filter((examiner) => examiner.neptun !== neptun));
    toast("Examiner deleted successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="heading-primary">Examiners Management</h1>
      <Button onClick={() => openDialog()} className="mb-4">
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
                <Button variant="outline" onClick={() => openDialog(examiner)} className="mr-2">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Examiner" : "Add Examiner"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="neptun"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neptun Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Neptun Code" disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Full Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="Enter Initial Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">{isEditing ? "Save Changes" : "Add Examiner"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Examiners;