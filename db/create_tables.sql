/*
    Proprietary code for InLinked TM
*/

CREATE TABLE IF NOT EXISTS `User` (
    UserId INTEGER NOT NULL AUTO_INCREMENT,
    Username CHAR(20) NOT NULL,
    Headline VARCHAR(255),
    Password VARCHAR(255) NOT NULL,
    Email CHAR(60) NOT NULL,
    ProfilePicture LONGTEXT,
    CoverPhoto LONGTEXT,
    Role CHAR(20) NOT NULL,
    AccType CHAR(20) NOT NULL,
    PRIMARY KEY (UserId),
    UNIQUE (Email),
    UNIQUE (Username)
);

-- Inherits User
CREATE TABLE IF NOT EXISTS `Enterprise` (
    EnterpriseId INTEGER NOT NULL,
    EnterpriseName VARCHAR(90) NOT NULL,
    EnterpriseDescription LONGTEXT NOT NULL,
    CEO VARCHAR(50),
    Headquarters VARCHAR(255),
    Industry VARCHAR(255),
    PRIMARY KEY (EnterpriseId),
    FOREIGN KEY (EnterpriseId) REFERENCES User(UserId)
);

-- Inherits User
CREATE TABLE IF NOT EXISTS `Candidate` (
    CandidateId INTEGER NOT NULL,
    FullName VARCHAR(50),
    DisplayEmail BIT DEFAULT 0,
    Skills TEXT,
    PRIMARY KEY (CandidateId),
    FOREIGN KEY (CandidateId) REFERENCES User(UserId)
);

CREATE TABLE IF NOT EXISTS `Job` (
    JobId INTEGER NOT NULL AUTO_INCREMENT,
    EnterpriseId INTEGER NOT NULL,
    JobTitle VARCHAR(255) NOT NULL,
    JobDescription TEXT NOT NULL,
    Salary VARCHAR(255),
    EmploymentType VARCHAR(30),
    ExperienceLevel VARCHAR(30),
    EducationLevel VARCHAR(30),
    City VARCHAR(255),
    Province VARCHAR(255),
    Country VARCHAR(255),
    JobURL TEXT,
    PostedDate DATE,
    PRIMARY KEY (JobId),
    FOREIGN KEY (EnterpriseId) REFERENCES Enterprise(EnterpriseId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Experience` (
    ExperienceId INTEGER NOT NULL AUTO_INCREMENT,
    UserId INTEGER NOT NULL,
    EnterpriseId INTEGER,
    EnterpriseName VARCHAR(255) NOT NULL,
    PositionName VARCHAR(255) NOT NULL,
    Description TEXT,
    StartMonth INTEGER NOT NULL,
    StartYear INTEGER NOT NULL,
    EndMonth INTEGER,
    EndYear INTEGER,
    Location VARCHAR(255),
    PRIMARY KEY (ExperienceId),
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    FOREIGN KEY (EnterpriseId) REFERENCES Enterprise(EnterpriseId)
);

CREATE TABLE IF NOT EXISTS `Education` (
    EducationId INTEGER NOT NULL AUTO_INCREMENT,
    CandidateId INTEGER NOT NULL,
    SchoolName VARCHAR(255) NOT NULL,
    StartMonth INTEGER NOT NULL,
    StartYear INTEGER NOT NULL,
    EndMonth INTEGER,
    EndYear INTEGER,
    Location VARCHAR(255),
    Degree VARCHAR(255), -- Same as EducationLevel
    PRIMARY KEY (EducationId),
    FOREIGN KEY (CandidateId) REFERENCES Candidate(CandidateId)
);

