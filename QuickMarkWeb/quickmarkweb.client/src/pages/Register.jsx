import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from 'react';
import { toast } from "sonner";

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        isAdmin: false,
    });
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register(formData);
            toast('Registration successful!');
            window.location.href = '/login';
        } catch (err) {
            setError('Registration failed.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <Input
                    type="text"
                    name="username"
                    placeholder="Neptun Code"
                    value={formData.username}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isAdmin"
                        checked={formData.isAdmin}
                        onChange={handleChange}
                    />
                    <span>Admin</span>
                </label>
                <Button type="submit" className="w-full">
                    Register
                </Button>
            </form>
        </div>
    );
}

export default Register;