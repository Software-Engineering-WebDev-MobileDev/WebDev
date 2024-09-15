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

CREATE TABLE `tblTasks` (
    `TaskID` VARCHAR(50)  NOT NULL ,
    `RecipeID` VARCHAR(50)  NOT NULL ,
    `AmountToBake` DECIMAL(10,2)  NOT NULL ,
    `Status` VARCHAR(20)  NOT NULL ,
    `DueDate` DATETIME  NOT NULL ,
    `AssignmentDate` DATETIME  NOT NULL ,
    `CompletionDate` DATETIME  NOT NULL ,
    `AssignedEmployeeID` VARCHAR(50)  NOT NULL ,
    PRIMARY KEY (
        `TaskID`
    )
);

CREATE TABLE `tblTaskComments` (
    `CommentID` VARCHAR(50)  NOT NULL ,
    `TaskID` VARCHAR(50)  NOT NULL ,
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    `CommentText` VARCHAR(MAX)  NOT NULL ,
    `CommentDate` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `CommentID`
    )
);

CREATE TABLE `tblTaskAssignmentHistory` (
    `AssignmentHistoryID` VARCHAR(50)  NOT NULL ,
    `TaskID` VARCHAR(50)  NOT NULL ,
    `AssignedByEmployeeID` VARCHAR(50)  NOT NULL ,
    `AssignedToEmployeeID` VARCHAR(50)  NOT NULL ,
    `AssignmentDate` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `AssignmentHistoryID`
    )
);

CREATE TABLE `tblTaskStatusAudit` (
    `StatusAuditID` VARCHAR(50)  NOT NULL ,
    `TaskID` VARCHAR(50)  NOT NULL ,
    `OldStatus` VARCHAR(20)  NOT NULL ,
    `NewStatus` VARCHAR(20)  NOT NULL ,
    `StatusChangedByEmployeeID` VARCHAR(50)  NOT NULL ,
    `StatusChangeDate` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `StatusAuditID`
    )
);

ALTER TABLE `tblUsers` ADD CONSTRAINT `fk_tblUsers_RoleID` FOREIGN KEY(`RoleID`)
REFERENCES `tblUserRoles` (`RoleID`);

ALTER TABLE `tblRecipes` ADD CONSTRAINT `fk_tblRecipes_CategoryID` FOREIGN KEY(`CategoryID`)
REFERENCES `tblCategories` (`CategoryID`);

ALTER TABLE `tblTasks` ADD CONSTRAINT `fk_tblTasks_RecipeID` FOREIGN KEY(`RecipeID`)
REFERENCES `tblRecipes` (`RecipeID`);

ALTER TABLE `tblTasks` ADD CONSTRAINT `fk_tblTasks_AssignedEmployeeID` FOREIGN KEY(`AssignedEmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblTaskComments` ADD CONSTRAINT `fk_tblTaskComments_TaskID` FOREIGN KEY(`TaskID`)
REFERENCES `tblTasks` (`TaskID`);

ALTER TABLE `tblTaskComments` ADD CONSTRAINT `fk_tblTaskComments_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblTaskAssignmentHistory` ADD CONSTRAINT `fk_tblTaskAssignmentHistory_TaskID` FOREIGN KEY(`TaskID`)
REFERENCES `tblTasks` (`TaskID`);

ALTER TABLE `tblTaskAssignmentHistory` ADD CONSTRAINT `fk_tblTaskAssignmentHistory_AssignedByEmployeeID` FOREIGN KEY(`AssignedByEmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblTaskAssignmentHistory` ADD CONSTRAINT `fk_tblTaskAssignmentHistory_AssignedToEmployeeID` FOREIGN KEY(`AssignedToEmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblTaskStatusAudit` ADD CONSTRAINT `fk_tblTaskStatusAudit_TaskID` FOREIGN KEY(`TaskID`)
REFERENCES `tblTasks` (`TaskID`);

ALTER TABLE `tblTaskStatusAudit` ADD CONSTRAINT `fk_tblTaskStatusAudit_StatusChangedByEmployeeID` FOREIGN KEY(`StatusChangedByEmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

