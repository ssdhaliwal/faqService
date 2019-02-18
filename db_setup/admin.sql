-- create database admin;
-- CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin!user';
-- GRANT ALL PRIVILEGES ON admin.* TO 'admin'@'localhost';
-- FLUSH PRIVILEGES;

use admin;

-- ==========================================================================================

DELIMITER //
drop function if exists fn_SPLIT_STR //
CREATE FUNCTION fn_SPLIT_STR (
  x VARCHAR(255),
  delim VARCHAR(12),
  pos INT
)
RETURNS VARCHAR(255)
RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, '') //
DELIMITER ;

-- ==========================================================================================

set delimiter //
drop table if exists users //
create table users (
	id int not null auto_increment primary key,
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    email varchar(150) not null,
    password varchar(256) not null,
    permissionLevel int not null,
    contentCount int default 0,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique index ix_users using btree(lastName, firstName))
//
drop view if exists vw_users //
create view vw_users as
	select id, firstName, lastName, email, password, permissionLevel, dateUpdated
	from users
//
delimiter ;

set delimiter //
drop procedure if exists spi_admin_user //
create procedure spi_admin_user (IN i_firstName varchar(50), IN i_lastName varchar(50), 
	IN i_email varchar(150), IN i_password varchar(256), IN i_permissionLevel int, 
    OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find id for the name
	select
		id
	into r_id 
    from
		vw_users
	where
		firstName = UCASE(i_firstName)
        and lastName = UCASE(i_lastName);

	-- if category does not exist, add it
    if (r_id IS NULL) then
        insert into users(firstName, lastName, email, password, permissionLevel) 
		values (UCASE(i_firstName), UCASE(i_lastName), i_email, i_password, i_permissionLevel);
		
        set r_id = last_insert_id();
	else
		update users set email = i_email, password = i_password, permissionLevel = i_permissionLevel
        where id = r_id;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spd_admin_user //
create procedure spd_admin_user (IN i_firstName varchar(50), IN i_lastName varchar(50),
    OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- if id is provided, then use it
    if (UCASE(i_firstName) = '$!$I$!$D$!$') then
		set r_id = CAST(i_lastName AS UNSIGNED);
    else 
		-- find id for the name
		select
			id
		into r_id 
		from
			vw_users
		where
			firstName = UCASE(i_firstName)
			and lastName = UCASE(i_lastName);
	end if;

	-- if category does not exist, add it
    if (r_id IS NOT NULL) then
		delete from users where id = r_id;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
delimiter ;

-- ==========================================================================================
