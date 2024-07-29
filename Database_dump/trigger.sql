USE `nfdb`;
DELIMITER //

CREATE TRIGGER before_insert_vehicles
BEFORE INSERT ON vehicles FOR EACH ROW
BEGIN
    IF NEW.driver_phone IS NULL OR TRIM(NEW.driver_phone) = '' THEN
        SET NEW.driver_phone = 'add_phone_no';
    END IF;
END //

DELIMITER ;
