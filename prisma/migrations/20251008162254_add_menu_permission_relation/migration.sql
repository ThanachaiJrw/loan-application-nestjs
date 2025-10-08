-- CreateTable
CREATE TABLE "_MenuPermissions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MenuPermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MenuPermissions_B_index" ON "_MenuPermissions"("B");

-- AddForeignKey
ALTER TABLE "_MenuPermissions" ADD CONSTRAINT "_MenuPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "menus"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuPermissions" ADD CONSTRAINT "_MenuPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;
