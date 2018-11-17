/*
    TEST USER DATA TO INSERT
*/
INSERT INTO User (Username, Headline, Password, Email, ProfilePicture, CoverPhoto, Role, AccType, CreateDate, LastActiveDate)
VALUES ('iguazu', 'second account', 'test', 'iguazu@gmail.com', 'img', 'img', 'user', 'candidate', NOW(), NOW());

INSERT INTO Candidate (CandidateId, FullName, Skills, EducationLevel, DisplayEmail)
VALUES (1, 'Iguana Banana', 'Java', 'bachelors', 1);

INSERT INTO User (Username, Headline, Password, Email, ProfilePicture, CoverPhoto, Role, AccType, CreateDate, LastActiveDate)
VALUES ('google', 'Google’s mission is to organize the world‘s information and make it universally accessible and useful. ', 'google', 'recruiting@google.com', 'img', 'img', 'user', 'enterprise', NOW(), NOW());

INSERT INTO Enterprise (CandidateId, EnterpriseName, EnterpriseDescription, CEO, Headquarters, Industry)
VALUES (2, 'Google', 'Since our founding in 1998, Google has grown by leaps and bounds. From offering search in a single language we now offer dozens of products and services—including various forms of advertising and web applications for all kinds of tasks—in scores of languages. And starting from two computer science students in a university dorm room, we now have thousands of employees and offices around the world. A lot has changed since the first Google search engine appeared. But some things haven’t changed: our dedication to our users and our belief in the possibilities of the Internet itself.', 'Sundar Pichai', 'Mountain View, CA', 'Internet');