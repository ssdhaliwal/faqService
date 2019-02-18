-- create database faq;
-- CREATE USER 'faq'@'localhost' IDENTIFIED BY 'faq!user';
-- GRANT ALL PRIVILEGES ON faq.* TO 'faq'@'localhost';
-- FLUSH PRIVILEGES;

use faq;

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
drop table if exists faq_categories //
create table faq_categories (
	id int not null auto_increment primary key,
    category varchar(50) not null,
    contentCount int default 0,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique index ix_faq_categories using btree(category))
//
delimiter ;

set delimiter //
drop view if exists vw_faq_categories //
create view vw_faq_categories as
	select id, category, contentCount, dateUpdated
	from faq_categories
//
delimiter ;

set delimiter //
drop procedure if exists spi_faq_categories //
create procedure spi_faq_categories (IN i_category varchar(50), OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find id for the category
	select
		id
	into r_id 
    from
		vw_faq_categories
	where
		category = UCASE(i_category);

	-- if category does not exist, add it
    if (r_id IS NULL) then
        insert into faq_categories(category) values (UCASE(i_category));
		
        set r_id = last_insert_id();
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spur_faq_categories //
create procedure spur_faq_categories (IN i_old_category varchar(50), i_new_category varchar(50), OUT o_count int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare n_id int;
    declare r_count int;
    set r_id = null;
    set n_id = null;
    set r_count = 0;

	-- find the old category id
	select
		id, contentCount
	into r_id, r_count
    from
		vw_faq_categories
	where
		category = UCASE(i_old_category);
        
	-- find the new category id
    select
		id
	into n_id
    from
		vw_faq_categories
	where
		category = UCASE(i_new_category);

	-- if new category is found, we are moving and deleting
    if (n_id IS NOT NULL) then
		-- create temp table for id's being changed
		-- update faq_content and change old_id to new if
        update faq_content a1, (select id from faq_content where category_id = r_id) a2
        set a1.category_id = n_id
        where a1.id = a2.id;
        
        call spuc_faq_categories(n_id, r_count, n_id);
        
        delete from faq_categories
        where category = UCASE(i_old_category);
        
        set r_id = n_id;
	-- if old category is found, rename it
    elseif (r_id IS NOT NULL) then
        update faq_categories SET category = UCASE(i_new_category)
		where id = r_id;
    end if;
    
    -- return if of record updated/inserted
	set o_count = r_count;
    SET o_id = r_id;
end //
drop procedure if exists spuc_faq_categories //
create procedure spuc_faq_categories (IN i_category_id int, i_contentCount int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find the category id being updated
	select
		id
	into r_id 
    from
		vw_faq_categories
	where
		id = i_category_id;

	-- if category is found, then update the count
    if (r_id IS NOT NULL) then
        update faq_categories SET contentCount = contentCount + i_contentCount
		where id = r_id;
        
        -- make sure we did not set it below zero
        update faq_categories set contentCount = 0
		where id = r_id and contentCount < 0;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spd_faq_categories_name //
create procedure spd_faq_categories_name (IN i_category varchar(50), OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find id for the category
	select
		id
	into r_id 
    from
		vw_faq_categories
	where
		category = UCASE(i_category)
        and contentCount = 0;

	-- if category does not exist, add it
    if (r_id IS NOT NULL) then
        delete from faq_categories where id = r_id;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spd_faq_categories_id //
create procedure spd_faq_categories_id (IN i_category_id int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find id for the category
	select
		id
	into r_id 
    from
		vw_faq_categories
	where
		id = i_category_id
        and contentCount = 0;

	-- if category does not exist, add it
    if (r_id IS NOT NULL) then
        delete from faq_categories where id = r_id;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
set delimiter ;

set delimiter //
drop table if exists faq_tags //
create table faq_tags (
	id int not null auto_increment primary key,
    tag varchar(50) not null,
    contentCount int default 0,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique index ix_faq_tags using btree(tag))
//
delimiter ;

set delimiter //
drop view if exists vw_faq_tags //
create view vw_faq_tags as
	select id, tag, contentCount, dateUpdated
	from faq_tags
//
delimiter ;

set delimiter //
drop procedure if exists spi_faq_tags //
create procedure spi_faq_tags (IN i_tag varchar(50), OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find if for the tag being added
	select
		id
	into r_id 
    from
		vw_faq_tags
	where
		tag = UCASE(i_tag);

	-- if no record found, add it
    if (r_id IS NULL) then
        insert into faq_tags(tag) values (UCASE(i_tag));
		
        set r_id = last_insert_id();
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spur_faq_tags //
create procedure spur_faq_tags (IN i_old_tag varchar(50), i_new_tag varchar(50), OUT o_count int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare n_id int;
    declare r_count int;
    set r_id = null;
    set n_id = null;
    set r_count = 0;

	-- find the old category id
	select
		id, contentCount
	into r_id, r_count
    from
		vw_faq_tags
	where
		tag = UCASE(i_old_tag);
        
	-- find the new category id
    select
		id
	into n_id
    from
		vw_faq_tags
	where
		tag = UCASE(i_new_tag);

	-- if new category is found, we are moving and deleting
    if (n_id IS NOT NULL) then
		-- create temp table for id's being changed
		-- update faq_content and change old_id to new if
        update faq_content_tags a1, (select id from faq_content_tags where tag_id = r_id) a2
        set a1.tag_id = n_id
        where a1.id = a2.id;
        
        call spuc_faq_tags(n_id, r_count, n_id);
        
        delete from faq_tags
        where tag = UCASE(i_old_tags);
        
        set r_id = n_id;
	-- if old category is found, rename it
    elseif (r_id IS NOT NULL) then
        update faq_tags SET tag = UCASE(i_new_tag)
		where id = r_id;
    end if;
    
    -- return if of record updated/inserted
	set o_count = r_count;
    SET o_id = r_id;
end //
drop procedure if exists spuc_faq_tags //
create procedure spuc_faq_tags (IN i_tag_id int, i_contentCount int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare r_count int;
    set r_id = null;
    set r_count = null;

	-- find the id of the tag being updated
	select
		id
	into r_id 
    from
		vw_faq_tags
	where
		id = i_tag_id;

	-- if the record is found, then update the count
    if (r_id IS NOT NULL) then
        update faq_tags SET contentCount = contentCount + i_contentCount
		where id = r_id;
        
        -- make sure we did not set it below zero
        update faq_tags set contentCount = 0
		where id = r_id and contentCount < 0;
    end if;
    
    -- check the count, if zero - delete the record
    select
		contentCount
	into r_count
    from vw_faq_tags
    where
		id = i_tag_id;
        
	-- if count = 0, then delete the record
    if (r_count = 0) then
		delete from faq_tags where id = r_id;
    end if;

    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spd_faq_tags_name //
create procedure spd_faq_tags_name (IN i_tag varchar(50), OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find id for the category
	select
		id
	into r_id 
    from
		vw_faq_tags
	where
		tag = UCASE(i_tag)
        and contentCount = 0;

	-- if category does not exist, add it
    if (r_id IS NOT NULL) then
        delete from faq_tags where id = r_id;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spd_faq_tags_id //
create procedure spd_faq_tags_id (IN i_tag_id int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    set r_id = null;

	-- find id for the category
	select
		id
	into r_id 
    from
		vw_faq_tags
	where
		id = i_tag_id
        and contentCount = 0;

	-- if category does not exist, add it
    if (r_id IS NOT NULL) then
        delete from faq_tags where id = r_id;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
set delimiter ;

set delimiter //
drop table if exists faq_content //
create table faq_content (
	id int not null auto_increment primary key,
    category_id int not null,
    title varchar(255) not null,
    content longtext not null,
    owner_id int not null,
    revised_by_id int,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	unique index uq_faq_title using btree(title),
    index ix_faq_category using btree(category_id),
    index ix_faq_owner using btree(owner_id),
    index ix_faq_revisedBy using btree(revised_by_id))
//
delimiter ;

set delimiter //
drop view if exists vw_faq_content //
create view vw_faq_content as
	select a.id, a.category_id, b.category, a.title, a.content, a.owner_id, a.revised_by_id, a.dateUpdated
	from faq_content a
		left outer join vw_faq_categories b on b.id = a.category_id
//
delimiter ;

set delimiter //
drop procedure if exists spi_faq_content //
create procedure spi_faq_content (IN i_category varchar(50), 
	IN i_title varchar(255), IN i_content longtext, IN i_owner_id int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare c_id int;
    set r_id = null;
    set c_id = null;

	-- find category id, for the content
	select
		id
	into c_id 
    from
		vw_faq_categories
	where
		category = UCASE(i_category);

	-- if category does not exist, add it
    if (c_id IS NULL) then
		CALL spi_faq_categories(i_category, c_id);
    end if;
	CALL spuc_faq_categories(c_id, 1, c_id);

	-- check if title exists, if yes, then return error
    select
		id
	into r_id
    from vw_faq_content
    where
		title = i_title;

	-- insert the content to the faq, if it does not exist
    if (r_id IS NULL) then
		insert into faq_content(category_id, title, content, owner_id) 
			values (c_id, i_title, i_content, i_owner_id);
	
		set r_id = last_insert_id();
	end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spu_faq_content //
create procedure spu_faq_content (IN i_content_id int, IN i_category varchar(50), 
	IN i_title varchar(255), IN i_content longtext, IN i_revised_by_id int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare r_category varchar(50);
    declare r_category_id int;
    declare c_id int;
    set r_id = null;
    set r_category_id = null;
    set c_id = null;

	-- find old content information
    select
		id, category, category_id
	into r_id, r_category, r_category_id
    from vw_faq_content
    where
		id = i_content_id;

	-- if the content does not exists, then add it
    if (r_id IS NULL) then
		CALL spi_faq_content(i_category, i_title, i_content, i_revised_by_id, r_id);
        else
        -- update the old record
        
        -- if category is provided and it is not same as old, we need to update category
        if (i_category IS NOT NULL and UCASE(i_category) != r_category) then
			-- decrese the count from the old category
            CALL spuc_faq_categories(r_category_id, -1, r_category_id);
            
			-- find category id for provided i_category
			select
				id
			into c_id 
			from
				vw_faq_categories
			where
				category = UCASE(i_category);
			
			-- if category does not exist, add it
			if (c_id IS NULL) then
				CALL spi_faq_categories(i_category, c_id);
			end if;
			CALL spuc_faq_categories(c_id, 1, c_id);
            
            -- update the record
            update faq_content set category_id = c_id, title = i_title,
				content = IFNULL(i_content, content), revised_by_id = i_revised_by_id
                where id = r_id;
		else
			-- category is not provided
            -- update the record
            update faq_content set title = i_title,
				content = IFNULL(i_content, content), revised_by_id = i_revised_by_id
                where id = r_id;
		end if;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
drop procedure if exists spd_faq_content //
create procedure spd_faq_content (IN i_content_id int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare r_category_id int;
    declare t_id int;
    set r_id = null;
    set r_category_id = null;
    set t_id = null;

	-- find old content information
    select
		id, category_id
	into r_id, r_category_id
    from vw_faq_content
    where
		id = i_content_id;

	-- if content exists
    if (r_id IS NOT NULL) then
		-- decrese the count from the old category
		CALL spuc_faq_categories(r_category_id, -1, r_category_id);

		-- clear the tags for the content
        call spu_faq_content_tags(null, r_id, 0, t_id);
        
		-- delete the record
		delete from faq_content 
		where id = r_id;
	end if;
    
    -- return if of record updated/inserted
    SET o_id = r_id;
end //
set delimiter ;

set delimiter //
drop table if exists faq_content_tags //
create table faq_content_tags (
	id int not null auto_increment primary key,
	tag_id int not null,
	content_id int not null,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique index uq_faq_content_tags using btree(tag_id, content_id),
    index ix_faq_content_tags_tag using btree(tag_id),
    index ix_faq_content_tags_content using btree(content_id))
//
delimiter ;

set delimiter //
drop view if exists vw_faq_content_tags //
create view vw_faq_content_tags as
	select a.id, a.tag_id, b.tag, a.content_id, a.dateUpdated
	from faq_content_tags a
		inner join vw_faq_tags b on b.id = a.tag_id
//
drop view if exists vw_faq_content_bytag //
create view vw_faq_content_bytag as
	select a.id, a.category_id, b.category, a.title, a.content, a.owner_id, a.revised_by_id, a.dateUpdated, c.tag_id
	from faq_content a
		left outer join vw_faq_categories b on b.id = a.category_id
        left outer join vw_faq_content_tags c on c.content_id = a.id
//
delimiter ;

set delimiter //
drop procedure if exists spu_faq_content_tags //
create procedure spu_faq_content_tags (IN i_tags varchar(8192), IN i_content_id int, IN i_action int, OUT o_id int)
begin
	-- check if exists, else insert
    declare r_id int;
    declare t_id int;
    declare t_tag varchar(50);
    declare s_count int;
    set r_id = null;
	set t_id = null;
    set t_tag = '-*-';
    set s_count = 0;

	-- make sure content_id is provided
    if (i_content_id IS NOT NULL) then
		-- check if the content exists
        select count(*)
        into s_count
        from vw_faq_content
        where id = i_content_id;
	end if;
    
	-- if no content, then exit
	if (s_count > 0) then
		set s_count = 0;
        
		-- loop until there are no more tags
        loop_tags: LOOP
			-- for each tag, update
			set s_count = s_count + 1;
			select fn_SPLIT_STR(i_tags, ',', s_count) into t_tag;

			if (t_tag = '' or t_tag IS NULL) then
				leave loop_tags;
			end if;
            
			-- get tag_id, create if does not exist
			CALL spi_faq_tags(t_tag, t_id);

			-- get record id of the current item
            set r_id = null;
			select id
			into r_id
			from vw_faq_content_tags
			where 
				tag_id = t_id and content_id = i_content_id;
			
			-- i_action = 0 = remove, 1 = add    
			if (i_action = 1) then                
				if (r_id IS NULL or r_id = 0) then
					-- update count and add the link
					CALL spuc_faq_tags(t_id, 1, t_id);

					-- insert the new link
					insert into faq_content_tags(tag_id, content_id) values (t_id, i_content_id);
					
					set r_id = last_insert_id();
				end if;
				else
					-- remove the link
					CALL spuc_faq_tags(t_id, -1, t_id);
					
					delete from faq_content_tags
					where id = r_id;
			end if;
		end loop;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = s_count;
end //
drop procedure if exists spd_faq_content_tags //
create procedure spd_faq_content_tags (IN i_content_id int, OUT o_id int)
begin
	-- check if exists, else insert
    declare t_tag varchar(50);
    declare t_id int;
    declare s_count int;

	declare done int default 0;
	declare curTags cursor for 
		select tag_id, tag from vw_faq_content_tags where content_id = i_content_id;
	declare continue handler for not found set done = 1;

    set t_tag = "";
	set t_id = null;
    set s_count = 0;

	-- make sure content_id is provided
    if (i_content_id IS NOT NULL) then
		-- loop until there are no more tags using cursor
        open curTags;
        loop_tags: LOOP
			-- for each tag, update
			set s_count = s_count + 1;
			fetch curTags into t_id, t_tag;
            if done then
				leave loop_tags;
			end if;
            
			-- remove the link
            CALL spu_faq_content_tags(t_tag, i_content_id, 0, t_id);
			CALL spuc_faq_tags(t_id, -1, t_id);
		end loop;
        
        -- close the cursor
        close curTags;
    end if;
    
    -- return if of record updated/inserted
    SET o_id = s_count;
end //
set delimiter ;

set delimiter //
drop view if exists vw_faq_category_summary //
create view vw_faq_category_summary as
select count(*) categoryCount from faq_categories //
drop view if exists vw_faq_tag_summary //
create view vw_faq_tag_summary as
select count(*) tagCount from faq_tags //
drop view if exists vw_faq_content_summary //
create view vw_faq_content_summary as
select count(*) contentCount from faq_content//
drop view if exists vw_faq_summary //
create view vw_faq_summary as
select a.categoryCount, b.tagCount, c.contentCount from
vw_faq_category_summary a, vw_faq_tag_summary b, vw_faq_content_summary c //
set delimiter ;

-- ==========================================================================================
