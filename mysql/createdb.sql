CREATE TABLE `Companies` (
  `Code` VARCHAR(255),
  `Title` VARCHAR(255),
  `Industry` VARCHAR(255),
  `Vertical` VARCHAR(255),
  `Canton` VARCHAR(255),
  `Spin-offs` VARCHAR(255),
  `City` VARCHAR(255),
  `Year` YEAR,
  `Highlights` VARCHAR(255),
  `Gender CEO` VARCHAR(255),
  `OOB` BIT,
  `Funded` BIT,
  `Comment` VARCHAR(255),
  PRIMARY KEY (`Code`)
);

CREATE TABLE `Deals` (
  `Id` VARCHAR(255),
  `Investors` VARCHAR(255),
  `Amount` FLOAT,
  `Valuation` FLOAT,
  `Comment` VARCHAR(255),
  `URL` VARCHAR(255),
  `Confidential` BIT,
  `Amount confidential` BIT,
  `Date of the funding round` DATE,
  `Type` VARCHAR(255),
  `Phase` VARCHAR(255),
  `Canton` VARCHAR(255),
  `Company` VARCHAR(255),
  `Gender CEO` VARCHAR(255),
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`Company`) REFERENCES `Companies`(`Code`)
);