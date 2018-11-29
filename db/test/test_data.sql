/*
    TESTING INSERTION FOR USER/ORGANIZATION
*/
INSERT INTO User (Username, Headline, Password, Email, Role, AccType)
VALUES ('Google', 'The Best Thing Ever', 'googlerocks', 'google@gmail.com', 'user', 'enterprise'); -- User

INSERT INTO Enterprise (EnterpriseId, EnterpriseName, EnterpriseDescription, CEO, HeadQuarters, Industry)
VALUES (1, 'Google', 'Best Company Ever', 'Sundar Pichai', 'Mountain View, CA', 'Internet/Software');

/*
    TEST DATA FOR USER
*/
INSERT INTO User (Username, Headline, Password, Email, ProfilePicture, CoverPhoto, Role, AccType)
VALUES ('johndoe', 'first account', 'test', 'test@tst.com', 'img', 'img', 'user', 'candidate');

INSERT INTO Candidate (CandidateId, FullName, Skills, EducationLevel, DisplayEmail)
VALUES (1, 'John Doe', 'C++, C#', 'bachelors', 1);

/*
    TESTING TRIGGER FOR USER/ORGANIZATION
    INVALID
*/
INSERT INTO Job (EnterpriseId, JobTitle, JobDescription, Salary, EmploymentType, ExperienceLevel, EducationLevel, City, Province, Country)
VALUES (1, 'Software Engineer', 'Code and shit', -1, 'Full Time', 'Entry Level', 'high school', 'New York', 'New York', 'United States');


/*
    TESTING TRIGGER FOR EMPLOYMENT
    INVALID
*/
INSERT INTO Job (EnterpriseId, JobTitle, JobDescription, Salary, EmploymentType, ExperienceLevel, EducationLevel, City, Province, Country)
VALUES (1, 'Software Engineer Intern', 'Code and shit', 90000, 'random type', 'Internship', 'high school', 'New York', 'New York', 'United States');

/*
    DELETE ENTRIES IN TABLE
*/
DELETE FROM Job WHERE JobId > 0;
DELETE FROM Enterprise WHERE EnterpriseId > 0;
DELETE FROM User WHERE UserId > 0;