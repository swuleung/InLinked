/*
    TESTING INSERTION FOR USER/ORGANIZATION
*/
INSERT INTO User (Username, Headline, Password, Email)
VALUES ('Google', 'The Best Thing Ever', 'googlerocks', 'google@gmail.com'); -- User

INSERT INTO Enterprise (EnterpriseId, EnterpriseName, EnterpriseDescription, CEO, HeadQuarters, Industry)
VALUES (1, 'Google', 'Best Company Ever', 'Sundar Pichai', 'Mountain View, CA', 'Internet/Software');

/*
    TESTING TRIGGER FOR USER/ORGANIZATION
*/
INSERT INTO Job (EnterpriseId, JobTitle, JobDescription, Salary, EmploymentType, ExperienceLevel, EducationLevel, City, Province, Country)
VALUES (1, 'Software Engineer', 'Code and shit', -1, 'Full Time', 'Entry Level', 'high school', 'New York', 'New York', 'United States');

/*
    DELETE ENTRIES IN TABLE
*/
DELETE FROM Job WHERE JobId > 0;
DELETE FROM Enterprise WHERE EnterpriseId > 0;
DELETE FROM User WHERE UserId > 0;