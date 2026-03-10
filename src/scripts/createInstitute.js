require("dotenv").config();
const connectDB = require("../utils/connectDB");

const Institute = require("../models/Institute");
const College = require("../models/College");
const Department = require("../models/Department");
const ResearchCenter = require("../models/ResearchCenter");
const createInstitute = async () => {
    try {
        await connectDB();

        await Department.deleteMany({});
        await College.deleteMany({});
        await Institute.deleteMany({});
        await ResearchCenter.deleteMany({});

        const institutesData = [
            {
                institute_name: "Institute of Medical and Health Sciences",
                research_center: {
                    research_center_name: "Medical Research Center"
                },
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
                research_center: {
                    research_center_name: "Engineering Innovation Center"
                },
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
                research_center: {
                    research_center_name: "Business and Legal Studies Center"
                },
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
                research_center: {
                    research_center_name: "Cultural and Social Research Center"
                },
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

            await ResearchCenter.create({
                research_center_name: instituteItem.research_center.research_center_name,
                institute_id: createdInstitute._id,
            });

            for (const collegeItem of instituteItem.colleges) {
                const createdCollege = await College.create({
                    college_name: collegeItem.college_name,
                    institute_id: createdInstitute._id
                });

                const departmentsWithCollegeId = collegeItem.departments.map(dep => ({
                    department_name: dep.department_name,
                    college_id: createdCollege._id,
                }));

                await Department.insertMany(departmentsWithCollegeId);
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