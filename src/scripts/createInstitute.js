require("dotenv").config();
const connectDB = require("../utils/connectDB");

const Institute = require("../models/Institute");
const College = require("../models/College");
const Department = require("../models/Department");
const createInstitute = async () => {
    try {
        await connectDB();

        await Department.deleteMany({});
        await College.deleteMany({});
        await Institute.deleteMany({});

        const institutesData = [
            {
                institute_name: "Institute of Medical and Health Sciences",
                colleges: [
                    {
                        college_name: "College of Medicine",
                        departments: [
                            {department_name: "Department of Clinical Sciences"},
                            {department_name: "Department of Basic Medical Sciences"},
                        ]

                    },
                    {
                        college_name: "College of Pharmacy",
                        departments: [
                            {department_name: "Department of Pharmacology"},
                            {department_name: "Department of Pharmaceutics"},
                        ]
                    },

                ]
            },
            {

                institute_name: "Institute of Engineering and Technology",
                colleges: [
                    {
                        college_name: "College of Engineering",
                        departments: [
                            {department_name: "Department of Civil Engineering"},
                            {department_name: "Department of Electrical Engineering"},
                        ]

                    },
                    {
                        college_name: "College of Computing and Informatics",
                        departments: [
                            {department_name: "Department of Computer Science"},
                            {department_name: "Department of Information Systems"},
                        ]
                    },

                ]
            },
            {
                institute_name: "Institute of Business and Law",
                colleges: [
                    {
                        college_name: "College of Business Administration",
                        departments: [
                            {department_name: "Department of Management"},
                            {department_name: "Department of Accounting"},
                        ]

                    },
                    {
                        college_name: "College of Law",
                        departments: [
                            {department_name: "Department of Public Law"},
                            {department_name: "Department of Private Law"},
                        ]
                    },

                ]
            },
            {
                institute_name: "Institute of Arts and Humanities",
                colleges: [
                    {
                        college_name: "College of Arts, Humanities and Social Sciences",
                        departments: [
                            {department_name: "Department of Arabic Language and Literature"},
                            {department_name: "Department of Sociology"},

                        ]

                    },
                    {
                        college_name: "College of Fine Arts and Design",
                        departments: [
                            {department_name: "Department of Graphic Design"},
                            {department_name: "Department of Interior Design"}
                        ]
                    },

                ]
            }
        ];

        for (const instituteItem of institutesData) {
            const createdInstitute = await Institute.create({
                institute_name: instituteItem.institute_name
            })

            for (const collegeItem of instituteItem.colleges) {
                const createdCollege = await College.create({
                    college_name: collegeItem.college_name,
                    institute_id: createdInstitute._id
                });

                for (const departmentItem of collegeItem.departments) {
                    const createdDepartment = await Department.create({
                        department_name: departmentItem.department_name,
                        college_id: createdCollege._id
                    })
                }
            }
        }
        console.log("✅ Data Seeded Successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error Creating Admin User:", error.message)
        process.exit(1);
    }
}

createInstitute();