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

CREATE TABLE `tblEmailTypes` (
    `EmailTypeID` VARCHAR(50)  NOT NULL ,
    `EmailTypeDescription` VARCHAR(50)  NOT NULL ,
    `Active` BIT  NOT NULL ,
    PRIMARY KEY (
        `EmailTypeID`
    )
);

CREATE TABLE `tblEmail` (
    `EmailID` VARCHAR(50)  NOT NULL ,
    `EmailAddress` VARCHAR(320)  NOT NULL ,
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    `EmailTypeID` VARCHAR(50)  NOT NULL ,
    `Valid` BIT  NOT NULL ,
    PRIMARY KEY (
        `EmailID`
    )
);

CREATE TABLE `tblPhoneTypes` (
    `PhoneTypeID` VARCHAR(50)  NOT NULL ,
    `PhoneTypeDescription` VARCHAR(50)  NOT NULL ,
    `Active` BIT  NOT NULL ,
    PRIMARY KEY (
        `PhoneTypeID`
    )
);

CREATE TABLE `tblPhoneNumbers` (
    `PhoneNumberID` VARCHAR(50)  NOT NULL ,
    `PhoneNumber` VARCHAR(10)  NOT NULL ,
    `PhoneTypeID` VARCHAR(50)  NOT NULL ,
    `Valid` BIT  NOT NULL ,
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    PRIMARY KEY (
        `PhoneNumberID`
    )
);

CREATE TABLE `tblSessions` (
    `SessionID` VARCHAR(50)  NOT NULL ,
    `EmployeeID` VARCHAR(50)  NOT NULL ,
    `CreateDateTime` DATETIME  NOT NULL ,
    `LastActivityDateTime` DATETIME  NOT NULL ,
    PRIMARY KEY (
        `SessionID`
    )
);

ALTER TABLE `tblUsers` ADD CONSTRAINT `fk_tblUsers_RoleID` FOREIGN KEY(`RoleID`)
REFERENCES `tblUserRoles` (`RoleID`);

ALTER TABLE `tblEmail` ADD CONSTRAINT `fk_tblEmail_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblEmail` ADD CONSTRAINT `fk_tblEmail_EmailTypeID` FOREIGN KEY(`EmailTypeID`)
REFERENCES `tblEmailTypes` (`EmailTypeID`);

ALTER TABLE `tblPhoneNumbers` ADD CONSTRAINT `fk_tblPhoneNumbers_PhoneTypeID` FOREIGN KEY(`PhoneTypeID`)
REFERENCES `tblPhoneTypes` (`PhoneTypeID`);

ALTER TABLE `tblPhoneNumbers` ADD CONSTRAINT `fk_tblPhoneNumbers_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

ALTER TABLE `tblSessions` ADD CONSTRAINT `fk_tblSessions_EmployeeID` FOREIGN KEY(`EmployeeID`)
REFERENCES `tblUsers` (`EmployeeID`);

