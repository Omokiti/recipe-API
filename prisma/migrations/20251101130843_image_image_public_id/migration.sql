/*
  Warnings:

  - You are about to drop the `Appointment_management` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clinical_notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Diagnosis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Emergency_contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hospital` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lab_test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medical_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medication_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient_practitioner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Practitioner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PractitionerSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Professional_certficate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Result_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment_management" DROP CONSTRAINT "Appointment_management_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Appointment_management" DROP CONSTRAINT "Appointment_management_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Clinical_notes" DROP CONSTRAINT "Clinical_notes_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Clinical_notes" DROP CONSTRAINT "Clinical_notes_record_id_fkey";

-- DropForeignKey
ALTER TABLE "Diagnosis" DROP CONSTRAINT "Diagnosis_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Diagnosis" DROP CONSTRAINT "Diagnosis_record_id_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_uploaded_by_fkey";

-- DropForeignKey
ALTER TABLE "Emergency_contact" DROP CONSTRAINT "Emergency_contact_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "Lab_test" DROP CONSTRAINT "Lab_test_ordering_doctor_fkey";

-- DropForeignKey
ALTER TABLE "Lab_test" DROP CONSTRAINT "Lab_test_record_id_fkey";

-- DropForeignKey
ALTER TABLE "Medical_history" DROP CONSTRAINT "Medical_history_record_id_fkey";

-- DropForeignKey
ALTER TABLE "Medication_items" DROP CONSTRAINT "Medication_items_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Medication_items" DROP CONSTRAINT "Medication_items_record_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientProfile" DROP CONSTRAINT "PatientProfile_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient_practitioner" DROP CONSTRAINT "Patient_practitioner_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient_practitioner" DROP CONSTRAINT "Patient_practitioner_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient_records" DROP CONSTRAINT "Patient_records_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient_records" DROP CONSTRAINT "Patient_records_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Practitioner" DROP CONSTRAINT "Practitioner_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "PractitionerSchedule" DROP CONSTRAINT "PractitionerSchedule_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Professional_certficate" DROP CONSTRAINT "Professional_certficate_practitioner_id_fkey";

-- DropForeignKey
ALTER TABLE "Result_value" DROP CONSTRAINT "Result_value_lab_test_id_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "image" TEXT,
ADD COLUMN     "imagePublicId" TEXT;

-- DropTable
DROP TABLE "Appointment_management";

-- DropTable
DROP TABLE "Clinical_notes";

-- DropTable
DROP TABLE "Diagnosis";

-- DropTable
DROP TABLE "Documents";

-- DropTable
DROP TABLE "Emergency_contact";

-- DropTable
DROP TABLE "Hospital";

-- DropTable
DROP TABLE "Lab_test";

-- DropTable
DROP TABLE "Medical_history";

-- DropTable
DROP TABLE "Medication_items";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "OTP";

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "PatientProfile";

-- DropTable
DROP TABLE "Patient_practitioner";

-- DropTable
DROP TABLE "Patient_records";

-- DropTable
DROP TABLE "Practitioner";

-- DropTable
DROP TABLE "PractitionerSchedule";

-- DropTable
DROP TABLE "Professional_certficate";

-- DropTable
DROP TABLE "Result_value";

-- DropTable
DROP TABLE "Token";

-- DropEnum
DROP TYPE "Appoint_status";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Method";

-- DropEnum
DROP TYPE "Patient_status";

-- DropEnum
DROP TYPE "ProfessionalCert_Status";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
