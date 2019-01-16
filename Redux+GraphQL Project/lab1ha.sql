CREATE DATABASE  IF NOT EXISTS `lab1ha` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `lab1ha`;
-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: lab1ha
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `properties` (
  `location` varchar(100) DEFAULT NULL,
  `propertyname` varchar(100) NOT NULL,
  `sleeps` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `amenities` varchar(500) DEFAULT NULL,
  `oname` varchar(25) DEFAULT NULL,
  `availableend` date DEFAULT NULL,
  `availablestart` date DEFAULT NULL,
  PRIMARY KEY (`propertyname`),
  KEY `owner_foreign` (`oname`),
  CONSTRAINT `owner_foreign` FOREIGN KEY (`oname`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES ('San Jose','San Jose Property 1',4,'Cottage House',2,2,90,'Kitchen, Fire Place, Washing Machine, Dishwasher','owner1@mail.com','2018-12-31','2018-10-08'),('San Jose','San Jose Property 2',4,'Lake House',2,2,70,'Kitchen','owner1@mail.com','2018-12-31','2018-10-10');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips_booking`
--

DROP TABLE IF EXISTS `trips_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `trips_booking` (
  `oname` varchar(25) DEFAULT NULL,
  `username` varchar(25) DEFAULT NULL,
  `propertyname` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `arrive` date DEFAULT NULL,
  `depart` date DEFAULT NULL,
  `guests` int(11) DEFAULT NULL,
  `cost_income` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips_booking`
--

LOCK TABLES `trips_booking` WRITE;
/*!40000 ALTER TABLE `trips_booking` DISABLE KEYS */;
INSERT INTO `trips_booking` VALUES ('owner1@mail.com','traveler2@mail.com','San Jose Property 1','San Jose','2018-10-25','2018-10-28',4,1440),('owner1@mail.com','traveler2@mail.com','San Jose Property 2','San Jose','2018-10-17','2018-10-22',4,1680),('owner1@mail.com','traveler1@mail.com','San Jose Property 2','San Jose','2018-10-25','2018-10-28',4,1120);
/*!40000 ALTER TABLE `trips_booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `username` varchar(25) NOT NULL,
  `passwrd` varchar(500) DEFAULT NULL,
  `uname` varchar(25) DEFAULT NULL,
  `phone` mediumtext,
  `aboutme` varchar(200) DEFAULT NULL,
  `city` varchar(25) DEFAULT NULL,
  `country` varchar(25) DEFAULT NULL,
  `school` varchar(50) DEFAULT NULL,
  `hometown` varchar(25) DEFAULT NULL,
  `languages` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `propowner` tinyint(1) DEFAULT NULL,
  `bookedproperty` varchar(100) DEFAULT NULL,
  `arrival` date DEFAULT NULL,
  `departure` date DEFAULT NULL,
  PRIMARY KEY (`username`),
  KEY `booked_foreign` (`bookedproperty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('owner1@mail.com','$2a$10$DlE3KGRLdU0W5XSbNEf1Y.LC6dHp6gYKQb9/CJrGTcSjQd17ntOEq','Owner 1','1234567890',NULL,'San Jose','USA',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL),('traveler1@mail.com','$2a$10$7l9e0YWvO9B3DM0w5lYoP.ObHEBOD.VHg2.AebkUlM/Mt2cGckCta','Traveler 1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),('traveler2@mail.com','$2a$10$rxeReKnhi4UTF79Q8bsU7uhlL/fnB3dYTAhuWUEo8wsTOBOGReRUu','Traveler 2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-07 18:12:46
