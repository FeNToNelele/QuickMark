import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from 'react';


const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Generate Exam Sheets</CardTitle>
            <CardDescription>
              Create exam sheets with QR codes for easy identification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Generate printable exam sheets for your students.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => window.location.href = "/generate-exam-sheets"}>
              Generate
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Exams</CardTitle>
            <CardDescription>
              List, add, and edit exams for your courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Organize and manage exams for your students.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => window.location.href = "/manage-exams"}>
              Manage Exams
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Examiners</CardTitle>
            <CardDescription>
              List, add, and edit examiners for your institution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Keep track of examiners and their associated exams.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => window.location.href = "/manage-examiners"}>
              Manage Examiners
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Courses</CardTitle>
            <CardDescription>
              List, add, and edit courses for your institution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Keep track of courses and their associated exams.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => window.location.href = "/manage-courses"}>
              Manage Courses
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;