/*
    Proprietary code for InLinked TM
*/

CREATE DATABASE IF NOT EXISTS InLinked_Db;

CREATE TABLE IF NOT EXISTS `User` (
    UserId INTEGER NOT NULL AUTO_INCREMENT,
    Username CHAR(20) NOT NULL,
    Headline VARCHAR(255),
    Password VARCHAR(255) NOT NULL,
    Email CHAR(60) NOT NULL,
    ProfilePicture TEXT,
    CoverPhoto TEXT,
    Role CHAR(20) NOT NULL,
    AccType CHAR(20) NOT NULL,
    CreateDate DATE,
    LastActiveDate DATE,
    PRIMARY KEY (UserId),
    UNIQUE (Email)
);

-- Inherits User
CREATE TABLE IF NOT EXISTS `Enterprise` (
    EnterpriseId INTEGER NOT NULL,
    EnterpriseName VARCHAR(90) NOT NULL,
    EnterpriseDescription VARCHAR(255) NOT NULL,
    CEO VARCHAR(50),
    HeadQuarters VARCHAR(255),
    Industry VARCHAR(50),
    PRIMARY KEY (EnterpriseId),
    FOREIGN KEY (EnterpriseId) REFERENCES User(UserId)
);

-- Inherits User
CREATE TABLE IF NOT EXISTS `Candidate` (
    CandidateId INTEGER NOT NULL,
    FullName VARCHAR(50),
    Skills TEXT,
    EducationLevel VARCHAR(30),
    DisplayEmail BIT DEFAULT 0,
    PRIMARY KEY (CandidateId),
    FOREIGN KEY (CandidateId) REFERENCES User(UserId)
);

CREATE TABLE IF NOT EXISTS `Job` (
    JobId INTEGER NOT NULL AUTO_INCREMENT,
    EnterpriseId INTEGER NOT NULL,
    JobTitle VARCHAR(50) NOT NULL,
    JobDescription TEXT NOT NULL,
    Salary INTEGER,
    EmploymentType VARCHAR(30),
    ExperienceLevel VARCHAR(30),
    EducationLevel VARCHAR(30),
    City VARCHAR(255),
    Province VARCHAR(255),
    Country VARCHAR(255),
    JobURL TEXT,
    PostedDate TEXT,
    PRIMARY KEY (JobId),
    FOREIGN KEY (EnterpriseId) REFERENCES Enterprise(EnterpriseId)
);

CREATE TABLE IF NOT EXISTS `Employee` (
    EmployeeId INTEGER NOT NULL AUTO_INCREMENT,
    Role VARCHAR(50) NOT NULL,
    DateJoined DATE NOT NULL,
    SupervisorId INTEGER,
    PRIMARY KEY (EmployeeId),
    FOREIGN KEY (SupervisorId) REFERENCES Employee(EmployeeId)
);

CREATE TABLE IF NOT EXISTS `Posts` (
    EmployerId INTEGER,
    JobId INTEGER,
    PostDate DATETIME,
    FOREIGN KEY (EmployerId) REFERENCES Enterprise(EnterpriseId),
    FOREIGN KEY (JobId) REFERENCES Job(JobId)
);

CREATE TABLE IF NOT EXISTS `ManageUsers` (
    EmployeeId INTEGER,
    UserId INTEGER,
    FOREIGN KEY (EmployeeId) REFERENCES Employee(EmployeeId),
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    PRIMARY KEY (EmployeeId, UserId)
);

CREATE TABLE IF NOT EXISTS `ManageJobs` (
    EmployeeId INTEGER,
    JobId INTEGER,
    FOREIGN KEY (EmployeeId) REFERENCES Employee(EmployeeId),
    FOREIGN KEY (JobId) REFERENCES Job(JobId),
    PRIMARY KEY (EmployeeId, JobId)
);

CREATE TABLE IF NOT EXISTS `Applies` (
    JobId INTEGER,
    CandidateId INTEGER,
    DateApplied DATETIME,
    PRIMARY KEY (JobId, CandidateId),
    FOREIGN KEY (JobId) REFERENCES Job(JobId),
    FOREIGN KEY (CandidateId) REFERENCES Candidate(CandidateId)
);

CREATE TABLE IF NOT EXISTS `Experience` {
    ExperienceId INTEGER NOT NULL AUTO_INCREMENT,
    UserId INTEGER NOT NULL,
    EnterpriseId INTEGER NOT NULL,
    EnterpriseName VARCHAR(255) NOT NULL,
    PositionName VARCHAR(255) NOT NULL,
    Description TEXT,
    StartDate DATE,
    Location VARCHAR(255)
}

-- Triggers
DELIMITER //

CREATE TRIGGER `PositiveSalaryCheck` BEFORE INSERT ON `Job`
FOR EACH ROW
    BEGIN
        IF `NEW`.Salary < 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Salary'; -- Stop insertion, throw error
        END IF;
    END//

CREATE TRIGGER `EmploymentTypeCheck` BEFORE INSERT ON `Job`
FOR EACH ROW
    BEGIN
        IF LOWER(`NEW`.EmploymentType) NOT IN ('full time', 'part time', 'contract', 'temporary', 'volunteer', 'other') THEN
            SIGNAL SQLSTATE '45001' SET MESSAGE_TEXT = 'Invalid Employment Type'; -- Stop insertion, throw error
        END IF;
    END//

CREATE TRIGGER `ExperienceLevelCheck` BEFORE INSERT ON `Job`
FOR EACH ROW
    BEGIN
        IF LOWER(`NEW`.ExperienceLevel) NOT IN ('entry level', 'internship', 'associate', 'senior', 'director', 'executive') THEN
            SIGNAL SQLSTATE '45002' SET MESSAGE_TEXT = 'Invalid Experience Level'; -- Stop insertion, throw error
        END IF;
    END//

CREATE TRIGGER `JobEducationLevelCheck` BEFORE INSERT ON `Job`
FOR EACH ROW
    BEGIN
        IF LOWER(`NEW`.EducationLevel) NOT IN ('high school', 'bachelors', 'masters', 'doctorate', 'postdoc') THEN
            SIGNAL SQLSTATE '45003' SET MESSAGE_TEXT = 'Invalid Job Education Level';
        END IF;
    END//

CREATE TRIGGER `CandidateEducationLevelCheck` BEFORE INSERT ON `Candidate`
FOR EACH ROW
    BEGIN
        IF LOWER(`NEW`.EducationLevel) NOT IN ('high school', 'bachelors', 'masters', 'doctorate', 'postdoc') THEN
          SIGNAL SQLSTATE '45004' SET MESSAGE_TEXT = 'Invalid Candidate Education Level';
        END IF;
    END//

DELIMITER ;
