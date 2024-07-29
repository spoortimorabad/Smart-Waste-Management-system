CREATE DATABASE  IF NOT EXISTS `nfdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `nfdb`;

DROP TABLE IF EXISTS `vehicles`;

CREATE TABLE vehicles (
    vehicle_id VARCHAR(10),
    area_id VARCHAR(10),
    driver_name VARCHAR(255) NOT NULL,
    driver_phone VARCHAR(15) NOT NULL,
    PRIMARY KEY (`driver_name`),
    FOREIGN KEY (area_id) REFERENCES area(area_id)
);


