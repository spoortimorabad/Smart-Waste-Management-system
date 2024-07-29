USE `nfdb`;
DELIMITER //
CREATE PROCEDURE GetComplaintAndWaste()
BEGIN
    SELECT
        c.user_id,
        c.area_name,
        c.driver_name,
        c.message AS complaint_message,
        c.complaint_date,
        w.bio_weight,
        w.non_bio_weight
    FROM
        complaint c
    JOIN
        waste_produced w ON c.user_id = w.user_id;
END //
DELIMITER ;

CALL GetComplaintAndWaste();
