import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Examiners from './pages/Examiners';
import Exams from './pages/Exams';
import GenerateExamSheets from './pages/GenerateExamSheet';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className='flex flex-col min-h-screen'>

                <Header />
                <main className='flex-grow p-6'>
                    <Routes>
                        {/* Redirect "/" to "/dashboard" */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* Public route */}
                        <Route path="/login" element={<Login />} />

                        {/* Protected routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/generate-exam-sheets"
                            element={
                                <ProtectedRoute>
                                    <GenerateExamSheets />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/manage-exams"
                            element={
                                <ProtectedRoute>
                                    <Exams />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/manage-examiners"
                            element={
                                <ProtectedRoute>
                                    <Examiners />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/manage-courses"
                            element={
                                <ProtectedRoute>
                                    <Courses />
                                </ProtectedRoute>
                            }
                        />


                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
                </div>
                <Toaster/>
            </Router>
        </AuthProvider>
    );
}

export default App;