-- CreateEnum
CREATE TYPE "Role" AS ENUM ('patient', 'doctor', 'nurse', 'specialist', 'admin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "Appoint_status" AS ENUM ('scheduled', 'completed', 'rescheduled', 'cancelled');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('in_person', 'virtual', 'follow_up');

-- CreateEnum
CREATE TYPE "Patient_status" AS ENUM ('active', 'confirmed', 'monitoring');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'cancelled', 'need_refills');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('chronic_conditions', 'family_history', 'allergies', 'past_surgeries');

-- CreateEnum
CREATE TYPE "ProfessionalCert_Status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Practitioner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo" TEXT,
    "password" TEXT NOT NULL,
    "hospital_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Practitioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional_certficate" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ProfessionalCert_Status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Professional_certficate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'patient',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientProfile" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "photo" TEXT,
    "NIN" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patient_id" TEXT NOT NULL,

    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emergency_contact" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "Emergency_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient_practitioner" (
    "patient_id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_practitioner_pkey" PRIMARY KEY ("patient_id","practitioner_id")
);

-- CreateTable
CREATE TABLE "Appointment_management" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Appoint_status" NOT NULL,
    "appointment_type" "Method" NOT NULL,
    "reason_for_visit" TEXT NOT NULL,
    "notes" TEXT,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_management_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachment" TEXT,
    "is_read" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient_records" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "blood_type" TEXT NOT NULL,
    "status" "Patient_status" NOT NULL,
    "last_visit" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication_items" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "refills" INTEGER NOT NULL,
    "instructions" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "notes" TEXT,
    "status" "Status" NOT NULL,

    CONSTRAINT "Medication_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical_history" (
    "id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medical_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinical_notes" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clinical_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "diagnosed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab_test" (
    "id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "tested_at" TIMESTAMP(3) NOT NULL,
    "ordering_doctor" TEXT NOT NULL,
    "lab_facility" TEXT NOT NULL,
    "clinical_interpretation" TEXT NOT NULL,

    CONSTRAINT "Lab_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result_value" (
    "id" TEXT NOT NULL,
    "lab_test_id" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "reference_range" TEXT NOT NULL,
    "flag" TEXT NOT NULL,

    CONSTRAINT "Result_value_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_email_key" ON "Hospital"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Practitioner_professional_id_key" ON "Practitioner"("professional_id");

-- CreateIndex
CREATE UNIQUE INDEX "Practitioner_email_key" ON "Practitioner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_phone_key" ON "PatientProfile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_NIN_key" ON "PatientProfile"("NIN");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_patient_id_key" ON "PatientProfile"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "OTP_code_key" ON "OTP"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Emergency_contact_profile_id_key" ON "Emergency_contact"("profile_id");

-- AddForeignKey
ALTER TABLE "Practitioner" ADD CONSTRAINT "Practitioner_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional_certficate" ADD CONSTRAINT "Professional_certficate_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfile" ADD CONSTRAINT "PatientProfile_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emergency_contact" ADD CONSTRAINT "Emergency_contact_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient_practitioner" ADD CONSTRAINT "Patient_practitioner_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient_practitioner" ADD CONSTRAINT "Patient_practitioner_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment_management" ADD CONSTRAINT "Appointment_management_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment_management" ADD CONSTRAINT "Appointment_management_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment_management"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient_records" ADD CONSTRAINT "Patient_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient_records" ADD CONSTRAINT "Patient_records_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication_items" ADD CONSTRAINT "Medication_items_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication_items" ADD CONSTRAINT "Medication_items_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "Patient_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_history" ADD CONSTRAINT "Medical_history_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "Patient_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinical_notes" ADD CONSTRAINT "Clinical_notes_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinical_notes" ADD CONSTRAINT "Clinical_notes_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "Patient_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "Patient_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lab_test" ADD CONSTRAINT "Lab_test_ordering_doctor_fkey" FOREIGN KEY ("ordering_doctor") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lab_test" ADD CONSTRAINT "Lab_test_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "Patient_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result_value" ADD CONSTRAINT "Result_value_lab_test_id_fkey" FOREIGN KEY ("lab_test_id") REFERENCES "Lab_test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
