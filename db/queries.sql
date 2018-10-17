/*
    Proprietary code for InLinked TM
*/

CREATE DATABASE InLinked_Db;

CREATE TABLE IF NOT EXISTS `User` (
    UserId INTEGER NOT NULL,
    Username CHAR(20) NOT NULL,
    Headline VARCHAR(255),
    Password VARCHAR(255) NOT NULL,
    Email CHAR(60) NOT NULL,
    PRIMARY KEY (UserId)
    -- Add triggers for constraints later
);

-- Inherits User
CREATE TABLE IF NOT EXISTS `Organization` (
    OrganizationId INTEGER NOT NULL,
    OrganizationName VARCHAR(90) NOT NULL,
    OrganizationDescription VARCHAR(255) NOT NULL,
    CEO VARCHAR(50),
    HeadQuarters VARCHAR(255),
    Industry VARCHAR(50),
    PRIMARY KEY (OrganizationId),
    FOREIGN KEY OrganizationId REFERENCES User(UserId)
);

-- Inherits User
CREATE TABLE IF NOT EXISTS `Candidate` (
    CandidateId INTEGER NOT NULL,
    FullName VARCHAR(50),
    Skills TEXT,
    Experience TEXT,                                        
    PRIMARY KEY CandidateId,
    FOREIGN KEY CandidateId REFERENCES Candidate(UserId)
);

CREATE TABLE IF NOT EXISTS `Job` (
    JobId INTEGER NOT NULL,
    OrganizationId INTERGER NOT NULL,
    JobTitle VARCHAR(50),
    JobDescription TEXT,
    Salary INTEGER,  
    EmploymentType VARCHAR(30),
    ExperienceLevel VARCHAR(30),
    EducationLevel VARCHAR(30),
    City VARCHAR(255),
    Province VARCHAR(255),
    Country VARCHAR(255),
    PRIMARY KEY (JobId),
    FOREIGN KEY (OrganizationId) REFERENCES Organization(OrganizationId)                                                                                                                                                                        
);

CREATE TABLE IF NOT EXISTS `Employee` (
    EmployeeId INTEGER NOT NULL,
    Role VARCHAR(50),
    DateJoined DATE NOT NULL,
    SupervisorId INTEGER,
    PRIMARY KEY (EmployeeId),
    FOREIGN KEY (SupervisorId) REFERENCES Employee(EmployeeId)                                                                                     
);

CREATE TABLE IF NOT EXISTS `Posts` (
    EmployerId INTEGER,
    JobId INTEGER,
    PostDate DATETIME,
    FOREIGN KEY (EmployerId) REFERENCES Organization(OrganizationId),
    FOREIGN KEY (JobId) REFERENCES Job(JobId)                                                             
);

CREATE TABLE IF NOT EXISTS `ManageUsers` (
    EmployeeId INTEGER,
    UserId INTEGER,
    FOREIGN KEY (EmployeeId) REFERENCES Employee(EmployeeId),
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    PRIMARY KEY (EmployeeId, UserId)                                            
);

CREATE TABLE IF NOT EXISTS 'ManagesJobs' (
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
    FOREIGN KEY (JobId) REFERENCES Job(JobId),
    FOREIGN KEY (Candidate) REFERENCES Candidate(CandidateId),
    PRIMARY KEY (JobId, CandidateId)
);