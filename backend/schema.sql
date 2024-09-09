CREATE TABLE tblIngredients (
    IngredientID VARCHAR(50) PRIMARY KEY,
    Description VARCHAR(50),
    Category VARCHAR(50),
    Measurement VARCHAR(50),
    MaximumAmount DECIMAL(6,2),
    ReorderAmount DECIMAL(6,2),
    MinimumAmount DECIMAL(6,2)
);

CREATE TABLE tblUsers (
    EmployeeID VARCHAR(50) PRIMARY KEY,
    FirstName VARCHAR(64),
    LastName VARCHAR(64),
    Username VARCHAR(20),
    Password VARCHAR(256)
);

CREATE TABLE tblSessions (
    SessionID VARCHAR(50) PRIMARY KEY,
    EmployeeID VARCHAR(50),
    CreateDateTime DATETIME,
    LastActivityDateTime DATETIME,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID)
);

CREATE TABLE tblEmailTypes (
    TypeID VARCHAR(50) PRIMARY KEY,
    Description VARCHAR(50),
    Active BIT
);

CREATE TABLE tblPhoneTypes (
    TypeID VARCHAR(50) PRIMARY KEY,
    Description VARCHAR(50),
    Active BIT
);

CREATE TABLE tblEmail (
    EmailID VARCHAR(50) PRIMARY KEY,
    EmailAddress VARCHAR(320),
    EmployeeID VARCHAR(50),
    TypeID VARCHAR(50),  -- I changed this to refer to tblEmailTypes
    Valid BIT,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID),
    FOREIGN KEY (TypeID) REFERENCES tblEmailTypes(TypeID)  -- new foreign key reference to tblEmailTypes
);

CREATE TABLE tblPhoneNumbers (
    PhoneNumberID VARCHAR(50) PRIMARY KEY,
    AreaCode VARCHAR(3),
    Number VARCHAR(7),
    TypeID VARCHAR(50),  -- I changed this to refer to tblPhoneTypes
    Valid BIT,
    EmployeeID VARCHAR(50),
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID),
    FOREIGN KEY (TypeID) REFERENCES tblPhoneTypes(TypeID)  -- new foreign key reference to tblPhoneTypes
);

CREATE TABLE tblRecipes (
    RecipeID      VARCHAR(50) PRIMARY KEY,
    RecipeName    VARCHAR(100),
    Instructions  VARCHAR(MAX),
    ScalingFactor FLOAT(24)
);

CREATE TABLE tblRecipeComponents (
    ComponentID VARCHAR(50) PRIMARY KEY,
    RecipeID VARCHAR(50),
    ComponentName VARCHAR(50),  -- could be "Batter" or "Frosting" etc
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID)
);

CREATE TABLE tblRecipeIngredients (
    RecipeIngredientID VARCHAR(50) PRIMARY KEY,
    ComponentID VARCHAR(50),
    IngredientID VARCHAR(50),
    Quantity FLOAT(24),  -- represents amount of the ingredient that's in the recipe
    Measurement VARCHAR(50),  -- could be "ounces", "grams"
    FOREIGN KEY (ComponentID) REFERENCES tblRecipeComponents(ComponentID),
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID)
);

CREATE TABLE tblInventory (
    EntryID VARCHAR(50) PRIMARY KEY,
    Quantity FLOAT(24), --represents amount added or removed. 5.5 ounces added, -5.5 ounces removed
    EmployeeID VARCHAR(50),
    Notes VARCHAR(50),
    Cost FLOAT(24),
    CreateDateTime DATETIME,
    ExpireDateTime DATETIME,
    PONumber VARCHAR(50),
    RecipeID VARCHAR(50),
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID),
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID)
);

CREATE TABLE tblTasks (
    TaskID VARCHAR(50) PRIMARY KEY,
    EmployeeID VARCHAR(50),
    TaskDescription VARCHAR(MAX),
    Status VARCHAR(20),      -- Task status (could be "Pending", "Completed", etc.)
    DueDate DATETIME,
    AssignmentDate DATETIME, -- When the task was assigned
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID)
);