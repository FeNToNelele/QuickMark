import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios from 'axios';

const examinerSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Neptun code can't be shorter than 6 characters." })
    .max(6, { message: "Neptun code can't be longer than 6 characters." }),
  fullName: z.string().min(1, { message: "Full name is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }).optional(),
});

const Examiners = () => {
    const [examiners, setExaminers] = useState([
        { username: "ABCDEF", fullName: "Kovács Béla", isAdmin: false },
        { username: "UVWXYZ", fullName: "Szabó Anna", isAdmin: false },
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ username: "", fullName: "", password: "", isAdmin: false });
    const [isEditing, setIsEditing] = useState(false);
    //const [selectedExaminer, setSelectedExaminer] = useState(null);
    //const form = useForm(
    //    {
    //        defaultValues:
    //        {
    //            username: "",
    //            fullName: "",
    //            password: "",
    //            isadmin: false,
    //        },
    //        resolver: zodResolver(examinerSchema),
    //    });
    // Fetch courses on mount
    useEffect(() => {
        const fetchUsers = () => {
            axios.get("/api/User")
                .then(res => setExaminers(res.data.map(u => ({
                    username: u.username,
                    fullName: u.fullName,
                    isAdmin: u.isAdmin,
                }))))
                .catch(() => toast("Failed to load examiners"));
        };
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddOrEdit = async () => {
        if (!formData.username || !formData.fullName || !formData.password) {
            toast("Fill in all fields!");
            return;
        }
        try {
            if (isEditing) {
                await axios.put(`/api/User/${formData.username}`,
                    {
                        username: formData.username,
                        fullName: formData.fullName,
                        //password: formData.password || "",
                        isAdmin: formData.isAdmin,
                    });
                setExaminers((prev) =>
                    prev.map((examiner) =>
                        examiner.username === formData.username
                            ? { ...examiner, fullName: formData.fullName, isAdmin: formData.isAdmin }
                            : examiner
                    ));

                toast("User updated!");
            }
            else {
                if (!formData.password) {
                    toast("Please provide a password for the new user!");
                    return;
                }
                await axios.post("/api/User",
                    {
                        username: formData.username,
                        fullName: formData.fullName,
                        password: formData.password,
                        isAdmin: formData.isAdmin,
                    });
                setExaminers((prev) =>
                    [...prev,
                    {
                        username: formData.username,
                        fullName: formData.fullName,
                        isAdmin: formData.isAdmin
                    }]);
                toast("User is added!");
            }
            setIsDialogOpen(false);
            setFormData(
                {
                    username: "",
                    fullName: "",
                    password: "",
                    isAdmin: false
                });
            setIsEditing(false);
        }
        catch
        {
            toast("Failed to save user!");
        }
    };

    const handleDelete = async (username) => {
        try {
            await axios.delete(`/api/User/${username}`);
            setExaminers((prev) => prev.filter((examiner) => examiner.username !== username));
            toast("Examiner deleted successfully!");
        }
        catch (error) {
            console.error("Failed to delete examiner:", error);
            if (error.response && error.response.status === 404) {
                toast("Examiner not found.");
            }
            else if (error.response && error.response.status === 400) {
                toast(error.response.data || "Failed to delete examiner due to dependencies.");
            }
            else {
                toast("Failed to delete examiner.");
            }
        }
    };
    const closeDialog = () =>
    {
        setIsDialogOpen(false);
        setFormData(
            {
                username: "",
                fullName: "",
                password: "",
                isAdmin: false
            });
        setIsEditing(false);
    };
    const openDialog = (examiner) =>
    {
        setFormData({
            username: examiner.username,
            fullName: examiner.fullName,
            isAdmin: examiner.isAdmin,
            password: "",
        });
        setIsDialogOpen(true);
        setIsEditing(true);
    };

    return (
        <div className="p-6">
            <h1 className="heading-primary">Examiner Management</h1>
            <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
                Add Course
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
                        <TableRow key={examiner.username}>
                            <TableCell>{examiner.username}</TableCell>
                            <TableCell>{examiner.fullName}</TableCell>
                            <TableCell>
                                <Button variant="outline" onClick={() => openDialog(examiner)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(examiner.username)} className="mr-2">
                                    Delete
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
                        <DialogTitle>{isEditing ? "Edit Examiner" : "Add Examiner"}</DialogTitle>
                    </DialogHeader>
                    <p id="dialog-description" className="text-sm text-muted-foreground">
                        {isEditing
                            ? "Edit the details of the selected examiner."
                            : "Fill in the details to add a new examiner."}
                    </p>
                    <div className="space-y-4">
                        <Input
                            name="username"
                            placeholder="Neptun Code"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={isEditing}
                        />
                        <Input
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={isEditing}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
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
export default Examiners;



































    {/* 
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
                        <TableRow key={examiner.username}>
                            <TableCell>{examiner.username}</TableCell>
                            <TableCell>{examiner.fullName}</TableCell>
                            <TableCell>
                                <Button variant="outline" onClick={() => openDialog(examiner)} className="mr-2">
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(examiner.username)} className="mr-2">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent aria-describedby="dialog-description">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Course" : "Add Course"}</DialogTitle>
                    </DialogHeader>
                    <p id="dialog-description" className="text-sm text-muted-foreground">
                        {isEditing
                            ? "Edit the details of the selected examiner."
                            : "Fill in the details to add a new examiner."}
                    </p>
                    <div className="space-y-4">
                        <Input
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="neptuncode"
                            placeholder="Neptun Code"
                            value={formData.username}
                            onChange={handleInputChange}
                            disabled={isEditing}
                        />
                        <Input
                            name="fullname"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            disabled={isEditing}
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

            */}



{/* <div className="p-6">
            <h1 className="heading-primary">Examiners Management</h1>
            <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
                Add Examiner
            </Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Neptun code</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        examiners.map((examiner) => (
                            //examiner && examiner.username ?
                            <TableRow key={examiner.username}>
                                <TableCell>{examiner.username}</TableCell>
                                <TableCell>{examiner.fullName}</TableCell>
                                <TableCell>
                                    <Button variant="outline" onClick={() => openDialog(examiner)} className="mr-2">
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(examiner.username)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>



            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent aria-describedby="dialog-description">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Examiner" : "Add Examiner"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddOrEdit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Neptun code</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                placeholder="Enter Neptun code"
                                                disabled={isEditing} />
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
                                            <Input {...field}
                                                placeholder="Enter Full Name"
                                            />
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
                                                <Input {...field} type="password"
                                                    placeholder="Enter Initial Password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => closeDialog()}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddOrEdit}>{isEditing ? "Save Changes" : "Add Examiner"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog> 
        </div>
    );
};
export default Examiners;*/}