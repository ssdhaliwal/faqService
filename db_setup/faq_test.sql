-- faq test scripts
-- create database faq;

use faq;
SET SQL_SAFE_UPDATES = 0;

-- ----------------------------------------------------------------------------------
-- ----------------------------------------------------------------------------------

-- test category procedures
CALL spi_faq_categories('this is a test', @rid);
-- select @rid;

CALL spi_faq_categories('this is a test -new', @rid);
-- select @rid;

CALL spur_faq_categories('this is a test', 'renamed test', @rcount, @rid);
-- select @rcount, @rid;

CALL spur_faq_categories('this is a test -new', 'renamed test', @rcount, @rid);
-- select @rcount, @rid;

CALL spi_faq_categories('this is a test - delete', @rid);
-- select @rid;

CALL spuc_faq_categories(1, 2, @rid);
-- select @rid;

CALL spuc_faq_categories(1, -5, @rid);
-- select @rid;

-- test tag procedures
CALL spi_faq_tags('this is a test', @rid);
-- select @rid;

CALL spi_faq_tags('tag1', @rid);
-- select @rid;

CALL spi_faq_tags('tag2', @rid);
-- select @rid;

CALL spur_faq_tags('this is a test', 'renamed test', @ocount, @rid);
-- select @ocount, @rid;

CALL spuc_faq_tags(1, 2, @rid);
-- select @rid;

CALL spuc_faq_tags(1, -5, @rid);
-- select @rid;

-- test content procedures
CALL spi_faq_content('this is a test', 'title-001', 'text of the content data', 1001, @rid);
-- select @rid;

CALL spi_faq_content('this is a test', 'title-002', 'text of the content data', 1001, @rid);
-- select @rid;

CALL spi_faq_content('this is a test', 'title-003', 'text of the content data', 1001, @rid);
-- select @rid;

CALL spi_faq_content('this is a test', 'title-004', 'text of the content data', 1001, @rid);
-- select @rid;

CALL spu_faq_content(1, 'this is a test', 'title-001', 'text of the content data - updated', 1002, @rid);
-- select @rid;

CALL spu_faq_content(1, 'renamed test', 'title-001', 'text of the content data - updated2', 1002, @rid);
-- select @rid;

CALL spu_faq_content(1, 'this is a test', 'title-001', null, 1002, @rid);
-- select @rid;

CALL spu_faq_content(1, 'renamed test', 'title-003', null, 1002, @rid);
-- select @rid;

CALL spu_faq_content(3, null, 'title-004A', 'text of the content data - updated 2334', 1002, @rid);
-- select @rid;

CALL spu_faq_content(1, null, 'title-002', 'text of the content data - updated 2334', 1002, @rid);
-- select @rid;

-- test content tag procedures
CALL spu_faq_content_tags('test', 1, 1, @rid);
-- select @rid;

CALL spu_faq_content_tags('test', 4, 1, @rid);
-- select @rid;

CALL spu_faq_content_tags('test', 4, 0, @rid);
-- select @rid;

CALL spu_faq_content_tags('test', 1, 0, @rid);
-- select @rid;

CALL spu_faq_content_tags('test2', 1, 0, @rid);
-- select @rid;

CALL spu_faq_content_tags('test1,test2,test3,test4,test5', 1, 1, @rid);
-- select @rid;

CALL spu_faq_content_tags('test1,test2,test3,test4,test5', 2, 1, @rid);
-- select @rid;

CALL spu_faq_content_tags('test11,test12,test13,test14,test15', 4, 1, @rid);
-- select @rid;

CALL spu_faq_content_tags('test1,test3,test5', 1, 0, @rid);
-- select @rid;

CALL spd_faq_content_tags(1, @rid);
-- select @rid;

CALL spd_faq_content_tags(4, @rid);
-- select @rid;

CALL spu_faq_content_tags('test4', 1, 0, @rid);
-- select @rid;

select * from vw_faq_categories;
select * from vw_faq_tags;

select * from vw_faq_content;
select * from vw_faq_content_tags;

-- ----------------------------------------------------------------------------------
-- ----------------------------------------------------------------------------------

CALL spd_faq_categories_name('test23', @rid);
-- select @rid;

CALL spd_faq_categories_name('THIS IS A TEST', @rid);
-- select @rid;

CALL spd_faq_categories_id(3, @rid);
-- select @rid;

CALL spd_faq_categories_id(6, @rid);
-- select @rid;

CALL spd_faq_tags_name('test5', @rid);
-- select @rid;

CALL spd_faq_tags_name('TEST223', @rid);
-- select @rid;

CALL spd_faq_tags_id(14, @rid);
-- select @rid;

CALL spd_faq_tags_id(3, @rid);
-- select @rid;


-- ----------------------------------------------------------------------------------
-- ----------------------------------------------------------------------------------

truncate table faq_tags;
truncate table faq_content_tags;

truncate table faq_categories;
-- delete from faq_categories where id in (9, 10, 11);
-- commit;
select * from vw_faq_categories;

truncate table faq_tags;

truncate table faq_content;


select * from vw_faq_tags;
select * from vw_faq_content_tags;

select a.categoryCount, b.tagCount, c.contentCount from
(select count(*) categoryCount from faq_categories) a,
(select count(*) tagCount from faq_tags) b,
(select count(*) contentCount from faq_content) c;

select * from faq_content;
select * from vw_faq_summary;

select fn_SPLIT_STR("one", ",", 2);
select fn_SPLIT_STR("one,two,3,4,5,6,7", ",", 3);
select fn_SPLIT_STR("one,two,3,4,5,6,7", ",", 5);
select fn_SPLIT_STR("one,two,3,4,5,6,7", ",", 8);


use mysql;

show variables like "max_connections";

use information_schema;

select substr(host, 1, 9),count(host) from processlist group by substr(host, 1, 9);
select id, user, host, db, command, time, state, info from processlist;
select concat('KILL ',id,';') from information_schema.processlist where user='root' and command='Sleep' into outfile '/tmp/a1.txt';
source /tmp/a1.txt;
