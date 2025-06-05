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

const examinerSchema = z.object({
  neptun: z
    .string()
    .min(6, { message: "Neptun code must be 6 characters long." })
    .max(6, { message: "Neptun code must be 6 characters long." }),
  fullName: z.string().min(1, { message: "Full name is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).optional(),
});

const Examiners = () => {
  const [examiners, setExaminers] = useState([]);
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

  useEffect(() => {
    fetchExaminers();
  }, []);

  const fetchExaminers = async () => {
    try {
      const response = await axios.get("/api/User/examiners");
      if (Array.isArray(response.data)) {
        setExaminers(response.data);
      }
    } catch (error) {
      toast("Failed to load examiners");
      console.error("Error loading examiners:", error);
    }
  };

  const openDialog = (examiner = null) => {
    setIsEditing(!!examiner);
    setSelectedExaminer(examiner);
    form.reset(examiner ? {
      neptun: examiner.neptun,
      fullName: examiner.fullName,
      password: ""
    } : {});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedExaminer(null);
    form.reset();
  };

  const handleSubmit = async (data) => {
    try {
      if (isEditing) {
        // For edit, we may not want to send password if it's empty
        const payload = {
          neptun: data.neptun,
          fullName: data.fullName,
          ...(data.password ? { password: data.password } : {})
        };
        
        await axios.put(`/api/User/examiner/${data.neptun}`, payload);
        toast("Examiner updated successfully");
        
        setExaminers(prev => 
          prev.map(e => e.neptun === data.neptun ? { ...e, fullName: data.fullName } : e)
        );
      } else {
        // For new examiners, password is required
        if (!data.password) {
          toast("Password is required for new examiners");
          return;
        }
        
        await axios.post("/api/User/examiner", data);
        toast("Examiner added successfully");
        fetchExaminers(); // Reload the list
      }
      
      closeDialog();
    } catch (error) {
      toast("Operation failed: " + (error.response?.data || error.message));
      console.error("Error saving examiner:", error);
    }
  };

  const handleDelete = async (neptun) => {
    if (!confirm("Are you sure you want to delete this examiner?")) {
      return;
    }
    
    try {
      await axios.delete(`/api/User/examiner/${neptun}`);
      toast("Examiner deleted successfully");
      setExaminers(prev => prev.filter(e => e.neptun !== neptun));
    } catch (error) {
      toast("Failed to delete examiner");
      console.error("Error deleting examiner:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Examiners</h1>
      <Button onClick={() => openDialog()} className="mb-4">
        Add New Examiner
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
          {examiners.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No examiners found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Examiner" : "Add New Examiner"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="neptun"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neptun Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isEditing} placeholder="ABC123" />
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
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditing ? "New Password (leave empty to keep current)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} placeholder="••••••" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog} type="button">
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