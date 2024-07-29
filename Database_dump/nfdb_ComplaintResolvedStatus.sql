use nfdb;

DROP TABLE IF EXISTS `ComplaintReslovedStatus`;

CREATE TABLE ComplaintResolvedStatus (
    `user_id` varchar(10) NOT NULL,
  `area_name` varchar(50) NOT NULL,
   `driver_name` varchar(255) NOT NULL,
    `complaint_status_message` varchar(100) NOT NULL
);
