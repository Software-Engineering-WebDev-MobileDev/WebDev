-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


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

CREATE TABLE `tblIngredientModifiers` (
    `ModifierID` VARCHAR(50)  NOT NULL ,
    `ModifierDescription` VARCHAR(255)  NOT NULL ,
    `CreatedAt` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `ModifierID`
    )
);

CREATE TABLE `tblRecipeIngredientModifiers` (
    `RecipeIngredientModifierID` VARCHAR(50)  NOT NULL ,
    `RecipeIngredientID` VARCHAR(50)  NOT NULL ,
    `ModifierID` VARCHAR(50)  NOT NULL ,
    PRIMARY KEY (
        `RecipeIngredientModifierID`
    )
);

ALTER TABLE `tblRecipes` ADD CONSTRAINT `fk_tblRecipes_CategoryID` FOREIGN KEY(`CategoryID`)
REFERENCES `tblCategories` (`CategoryID`);

ALTER TABLE `tblRecipeIngredients` ADD CONSTRAINT `fk_tblRecipeIngredients_RecipeID` FOREIGN KEY(`RecipeID`)
REFERENCES `tblRecipes` (`RecipeID`);

ALTER TABLE `tblRecipeIngredients` ADD CONSTRAINT `fk_tblRecipeIngredients_ScalingFactorID` FOREIGN KEY(`ScalingFactorID`)
REFERENCES `tblScalingFactors` (`ScalingFactorID`);

ALTER TABLE `tblRecipeIngredientModifiers` ADD CONSTRAINT `fk_tblRecipeIngredientModifiers_RecipeIngredientID` FOREIGN KEY(`RecipeIngredientID`)
REFERENCES `tblRecipeIngredients` (`RecipeIngredientID`);

ALTER TABLE `tblRecipeIngredientModifiers` ADD CONSTRAINT `fk_tblRecipeIngredientModifiers_ModifierID` FOREIGN KEY(`ModifierID`)
REFERENCES `tblIngredientModifiers` (`ModifierID`);

