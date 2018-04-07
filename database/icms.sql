-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2018 at 03:34 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `icms`
--

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `Doc_ID` int(30) DEFAULT NULL,
  `Days` varchar(59) NOT NULL,
  `TIMEFROM` varchar(30) NOT NULL,
  `TIMETO` varchar(30) NOT NULL,
  `clinic_ID` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`Doc_ID`, `Days`, `TIMEFROM`, `TIMETO`, `clinic_ID`) VALUES
(1, 'monday', '8', '10', 1),
(1, 'tuesday', '8', '10', 1),
(1, 'monday', '8', '10', 2);

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `bill_ID` int(30) NOT NULL,
  `TotalPrice` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`bill_ID`, `TotalPrice`) VALUES
(1, 0),
(2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `bill_desc`
--

CREATE TABLE `bill_desc` (
  `bill_ID` int(30) DEFAULT NULL,
  `ServiceID` int(11) DEFAULT NULL,
  `Description` varchar(59) DEFAULT NULL,
  `Price` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `clinics`
--

CREATE TABLE `clinics` (
  `clinic_ID` int(30) NOT NULL,
  `Name` varchar(59) DEFAULT NULL,
  `avalibality` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clinics`
--

INSERT INTO `clinics` (`clinic_ID`, `Name`, `avalibality`) VALUES
(1, 'skull', 0),
(3, 'skin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `Doc_ID` int(30) NOT NULL,
  `Name` varchar(59) DEFAULT NULL,
  `PhoneNumber` int(20) DEFAULT NULL,
  `specialized` varchar(59) DEFAULT NULL,
  `price` int(20) DEFAULT NULL,
  `User_ID` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`Doc_ID`, `Name`, `PhoneNumber`, `specialized`, `price`, `User_ID`) VALUES
(1, 'HMED', NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `emp`
--

CREATE TABLE `emp` (
  `emp_ID` int(30) NOT NULL,
  `emp_Name` varchar(59) DEFAULT NULL,
  `emp_job` varchar(59) DEFAULT NULL,
  `emp_salary` int(20) DEFAULT NULL,
  `EmpAddress` varchar(100) NOT NULL,
  `EmpPhoneNumber` int(20) NOT NULL,
  `User_ID` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `MedicineID` int(11) NOT NULL,
  `MedicineName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `patient_ID` int(30) NOT NULL,
  `Name` varchar(59) DEFAULT NULL,
  `address` varchar(59) DEFAULT NULL,
  `date Of  Birth` date DEFAULT NULL,
  `phone number` int(13) DEFAULT NULL,
  `Blood type` varchar(3) DEFAULT NULL,
  `temDES` varchar(59) DEFAULT NULL,
  `User_ID` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_ID`, `Name`, `address`, `date Of  Birth`, `phone number`, `Blood type`, `temDES`, `User_ID`) VALUES
(15, 'ALIIIIII', 'undefined', '0000-00-00', 0, 'und', 'undefined', 2);

-- --------------------------------------------------------

--
-- Table structure for table `perdescription`
--

CREATE TABLE `perdescription` (
  `perscription_ID` int(30) DEFAULT NULL,
  `Medicence` int(11) DEFAULT NULL,
  `Description` varchar(59) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `prescription`
--

CREATE TABLE `prescription` (
  `perscription_ID` int(30) NOT NULL,
  `Diagnosis` varchar(59) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `ID` int(20) NOT NULL,
  `Rolename` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`ID`, `Rolename`) VALUES
(1, 'Manager'),
(2, 'Employee'),
(3, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `ServiceID` int(11) NOT NULL,
  `ServiceName` varchar(30) NOT NULL,
  `ServicePrice` int(11) NOT NULL,
  `ServiceType` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `servicetypes`
--

CREATE TABLE `servicetypes` (
  `Type_ID` int(11) NOT NULL,
  `TypeName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `ID` int(13) NOT NULL,
  `Doc_ID` int(30) DEFAULT NULL,
  `clinic_ID` int(30) DEFAULT NULL,
  `patient_ID` int(30) DEFAULT NULL,
  `bill_ID` int(30) DEFAULT NULL,
  `emp_ID` int(30) DEFAULT NULL,
  `perscription_ID` int(30) DEFAULT NULL,
  `TransactionDate` date DEFAULT NULL,
  `AppointmentDate` date NOT NULL,
  `Completed` tinyint(1) NOT NULL,
  `Paid` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_ID` int(30) NOT NULL,
  `UserName` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `RoleID` int(20) NOT NULL,
  `CreatedAt` date NOT NULL,
  `LastLogin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_ID`, `UserName`, `password`, `RoleID`, `CreatedAt`, `LastLogin`) VALUES
(0, 'ABDO', 'ABDO', 3, '0000-00-00', '0000-00-00'),
(1, 'AlyAbd', '123', 2, '2018-03-14', '2018-03-22'),
(2, 'ABDO', 'ABDO', 3, '0000-00-00', '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`Days`,`TIMEFROM`,`TIMETO`,`clinic_ID`),
  ADD KEY `FK` (`Doc_ID`,`clinic_ID`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`bill_ID`);

--
-- Indexes for table `bill_desc`
--
ALTER TABLE `bill_desc`
  ADD KEY `FK` (`bill_ID`),
  ADD KEY `Services_BillDesc` (`ServiceID`);

--
-- Indexes for table `clinics`
--
ALTER TABLE `clinics`
  ADD PRIMARY KEY (`clinic_ID`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`Doc_ID`),
  ADD UNIQUE KEY `User_ID` (`User_ID`);

--
-- Indexes for table `emp`
--
ALTER TABLE `emp`
  ADD PRIMARY KEY (`emp_ID`),
  ADD UNIQUE KEY `User_ID` (`User_ID`);

--
-- Indexes for table `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`MedicineID`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`patient_ID`),
  ADD UNIQUE KEY `User_ID` (`User_ID`);

--
-- Indexes for table `perdescription`
--
ALTER TABLE `perdescription`
  ADD KEY `FK` (`perscription_ID`);

--
-- Indexes for table `prescription`
--
ALTER TABLE `prescription`
  ADD PRIMARY KEY (`perscription_ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`ServiceID`),
  ADD KEY `ServiceType` (`ServiceType`);

--
-- Indexes for table `servicetypes`
--
ALTER TABLE `servicetypes`
  ADD PRIMARY KEY (`Type_ID`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK` (`Doc_ID`,`clinic_ID`,`patient_ID`,`bill_ID`,`emp_ID`,`perscription_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_ID`),
  ADD KEY `Roles_Users` (`RoleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `bill_ID` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clinics`
--
ALTER TABLE `clinics`
  MODIFY `clinic_ID` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `Doc_ID` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `emp`
--
ALTER TABLE `emp`
  MODIFY `emp_ID` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `patient_ID` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `prescription`
--
ALTER TABLE `prescription`
  MODIFY `perscription_ID` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `ID` int(13) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill_desc`
--
ALTER TABLE `bill_desc`
  ADD CONSTRAINT `Services_BillDesc` FOREIGN KEY (`ServiceID`) REFERENCES `services` (`ServiceID`);

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `Users_Doctor` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`);

--
-- Constraints for table `emp`
--
ALTER TABLE `emp`
  ADD CONSTRAINT `Users_Emp` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`);

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `Users_Patient` FOREIGN KEY (`User_ID`) REFERENCES `users` (`User_ID`);

--
-- Constraints for table `perdescription`
--
ALTER TABLE `perdescription`
  ADD CONSTRAINT `Medicine_prescription` FOREIGN KEY (`perscription_ID`) REFERENCES `medicine` (`MedicineID`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`ServiceType`) REFERENCES `servicetypes` (`Type_ID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `Roles_Users` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
