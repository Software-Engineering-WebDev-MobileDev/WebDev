-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE `tblUserRoles` (
    `RoleID` VARCHAR(50)  NOT NULL ,
    `RoleName` VARCHAR(50)  NOT NULL ,
    `RoleDescription` VARCHAR(255)  NOT NULL ,
    PRIMARY KEY (
        `RoleID`
    )
);

CREATE TABLE `tblUsers` (
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    `FirstName` VARCHAR(64)  NOT NULL ,
    `LastName` VARCHAR(64)  NOT NULL ,
    `Username` VARCHAR(20)  NOT NULL ,
    `Password` VARCHAR(256)  NOT NULL ,
    `RoleID` VARCHAR(50)  NOT NULL ,
    `EmploymentStatus` BIT  NOT NULL ,
    `StartDate` DATE  NOT NULL ,
    `EndDate` DATE  NOT NULL ,
    PRIMARY KEY (
        `EmployeeID`
    )
);

CREATE TABLE `tblCategories` (
    `CategoryID` VARCHAR(50)  NOT NULL ,
    `CategoryName` VARCHAR(50)  NOT NULL ,
    PRIMARY KEY (
        `CategoryID`
    )
);

CREATE TABLE `tblScalingFactors` (
    `ScalingFactorID` VARCHAR(50)  NOT NULL ,
    `ScaleFactor` DECIMAL(5,2)  NOT NULL ,
    `Description` VARCHAR(255)  NOT NULL ,
    `CreatedAt` DATETIME  NOT NULL ,
    `UpdatedAt` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `ScalingFactorID`
    )
);

CREATE TABLE `tblRecipes` (
    `RecipeID` VARCHAR(50)  NOT NULL ,
    `RecipeName` VARCHAR(100)  NOT NULL ,
    `Description` VARCHAR(MAX)  NOT NULL ,
    `CategoryID` VARCHAR(50)  NOT NULL ,
    `PrepTime` INT  NOT NULL ,
    `CookTime` INT  NOT NULL ,
    `TotalTime` INT  NOT NULL ,
    `Servings` INT  NOT NULL ,
    `Instructions` VARCHAR(MAX)  NOT NULL ,
    `CreatedAt` DATETIME  NOT NULL ,
    `UpdatedAt` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `RecipeID`
    )
);

CREATE TABLE `tblRecipeIngredients` (
    `RecipeIngredientID` VARCHAR(50)  NOT NULL ,
    `RecipeID` VARCHAR(50)  NOT NULL ,
    `IngredientDescription` VARCHAR(50)  NOT NULL ,
    `Quantity` DECIMAL(10,2)  NOT NULL ,
    `UnitOfMeasure` VARCHAR(50)  NOT NULL ,
    `QuantityInStock` Decimal(10,2)  NOT NULL ,
    `ReorderFlag` BIT  NOT NULL ,
    `ModifierID` VARCHAR(50)  NOT NULL ,
    `ScalingFactorID` VARCHAR(50)  NOT NULL ,
    PRIMARY KEY (
        `RecipeIngredientID`
    )
);

CREATE TABLE `tblInventory` (
    `EntryID` VARCHAR(50)  NOT NULL ,
    `IngredientDescription` VARCHAR(50)  NOT NULL ,
    `Quantity` DECIMAL(10,2)  NOT NULL ,
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    `Notes` VARCHAR(255)  NOT NULL ,
    `Cost` DECIMAL(10,2)  NOT NULL ,
    `CreateDateTime` DATETIME  NOT NULL ,
    `ExpireDateTime` DATETIME  NOT NULL ,
    `ReorderAmount` DECIMAL(10,2)  NOT NULL ,
    `MinimumQuantity` DECIMAL(10,2)  NOT NULL ,
    `MaximumQuantity` DECIMAL(10,2)  NOT NULL ,
    PRIMARY KEY (
        `EntryID`
    )
);

CREATE TABLE `tblInventoryAudit` (
    `InventoryAuditID` VARCHAR(50)  NOT NULL ,
    `InventoryEntryID` VARCHAR(50)  NOT NULL ,
    `OldQuantity` DECIMAL(10,2)  NOT NULL ,
    `NewQuantity` DECIMAL(10,2)  NOT NULL ,
    `ChangeReason` VARCHAR(255)  NOT NULL ,
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    `ChangeDate` DATETIME  NOT NULL ,
    `PONumber` VARCHAR(50)  NOT NULL ,
    PRIMARY KEY (
        `InventoryAuditID`
    )
);

ALTER TABLE `tblUsers` ADD CONSTRAINT `fk_tblUsers_RoleID` FOREIGN KEY(`RoleID`)
REFERENCES `tblUserRoles` (`RoleID`);

ALTER TABLE `tblRecipes` ADD CONSTRAINT `fk_tblRecipes_CategoryID` FOREIGN KEY(`CategoryID`)
REFERENCES `tblCategories` (`CategoryID`);

ALTER TABLE `tblRecipeIngredients` ADD CONSTRAINT `fk_tblRecipeIngredients_RecipeID` FOREIGN KEY(`RecipeID`)
REFERENCES `tblRecipes` (`RecipeID`);

ALTER TABLE `tblRecipeIngredients` ADD CONSTRAINT `fk_tblRecipeIngredients_ScalingFactorID` FOREIGN KEY(`ScalingFactorID`)
REFERENCES `tblScalingFactors` (`ScalingFactorID`);

ALTER TABLE `tblInventory` ADD CONSTRAINT `fk_tblInventory_IngredientDescription` FOREIGN KEY(`IngredientDescription`)
REFERENCES `tblRecipeIngredients` (`IngredientDescription`);

ALTER TABLE `tblInventory` ADD CONSTRAINT `fk_tblInventory_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblInventoryAudit` ADD CONSTRAINT `fk_tblInventoryAudit_InventoryEntryID` FOREIGN KEY(`InventoryEntryID`)
REFERENCES `tblInventory` (`EntryID`);

ALTER TABLE `tblInventoryAudit` ADD CONSTRAINT `fk_tblInventoryAudit_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

