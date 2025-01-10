# Patient Medical History Management System

## Overview
This project is a web-based application designed to manage patient medical records. It allows two types of users—practitioners and patients—with different functionalities:

- **Practitioners** can log in, add patient records (e.g., allergies, lab orders, lab results, prescriptions).
- **Patients** can log in to view their medical history in a user-friendly format.

## Features

### Practitioner Features
- Practitioner can log in using **username** and **password**.
- Practitioners can view a list of patients.
- They can add the following data to a patient's record:
  - **Allergies**: A list of known allergies.
  - **Lab Orders**: Specify tests ordered (e.g., "CBC", "X-ray").
  - **Lab Results**: Record results for previous lab orders (e.g., "CBC: Normal").
  - **Prescriptions**: Add medication names, dosages, and instructions.
  
### Patient Features
- Patients can log in and view their medical history in a clean and user-friendly format.
- They can see the following information:
  - **Allergies**: Displayed as a simple list.
  - **Lab Orders & Results**: Grouped under respective lab orders.
  - **Prescriptions**: Show medication names, dosages, and instructions.

### Bonus Features
- **Upload lab result files** (e.g., PDFs or images).
- **Summary view** on the patient dashboard: Show important health data (e.g., active prescriptions, pending lab results).
- **Search functionality** for practitioners to filter patients by name or ID.

## Tech Stack

- **Client**: React.js
- **Server**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)