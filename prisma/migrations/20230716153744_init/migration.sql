-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "csvFile" TEXT NOT NULL
);
