-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "modelNumber" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchaseOrderId" INTEGER NOT NULL,
    CONSTRAINT "PurchaseItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
