-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `groupName` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `expectedSalary` INTEGER NOT NULL,
    `expectedDateOfDefense` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
