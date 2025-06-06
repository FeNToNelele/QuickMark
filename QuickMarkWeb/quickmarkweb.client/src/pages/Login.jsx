import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from 'react';

function Login() {
    const [neptun, setNeptun] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!neptun || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await login(neptun, password);
            setError('');
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Invalid credentials or server error.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] ">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <Input
                    type="text"
                    placeholder="Neptun Code"
                    value={neptun}
                    onChange={(e) => setNeptun(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" className="w-full">
                    Login
                </Button>
            </form>
        </div>
    );
}

export default Login;