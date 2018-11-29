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
        IF LOWER(`NEW`.EmploymentType) NOT IN ('full-time', 'part-time', 'contract', 'temporary', 'volunteer', 'other') THEN
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


DELIMITER ;