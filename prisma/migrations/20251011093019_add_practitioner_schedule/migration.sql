-- CreateTable
CREATE TABLE "PractitionerSchedule" (
    "id" TEXT NOT NULL,
    "practitioner_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_hour" INTEGER NOT NULL,
    "end_hour" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PractitionerSchedule" ADD CONSTRAINT "PractitionerSchedule_practitioner_id_fkey" FOREIGN KEY ("practitioner_id") REFERENCES "Practitioner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
