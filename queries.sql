drop database if exists garasi_ku;
create database garasi_ku;
use garasi_ku;

-- ----------------- Tables
create or replace table users (
    id int primary key auto_increment,
    name varchar(255) not null,
    username varchar(255) unique not null,
    password varchar(255) not null,
    role enum('user', 'admin', 'superadmin') not null
);

create or replace table garasi (
    id int primary key auto_increment,
    name varchar(255) not null,
    jenis enum('Motor', 'Mobil', 'Helikopter') not null,
    isAvailable boolean not null
);
-- ----------------- Tables

-- ----------------- Procedures
delimiter //
create or replace procedure register(
    in _name varchar(255),
    in _username varchar(255),
    in _password varchar(255),
    in _role enum('user', 'admin', 'superadmin')
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    if (_name is null or length(_name) < 1) then
        signal sqlstate
            '45000'
        set
            message_text = 'Nama tidak boleh kosong';
    end if;

    if (length(_username) < 3) then
        signal sqlstate
            '45000'
        set
            message_text = 'Panjang username minimal 3 karakter';
    end if;

    if (length(_password) < 8) then
        signal sqlstate
            '45000'
        set
            message_text = 'Panjang password minimal 8 karakter';
    end if;

    insert into
        users
    set
        users.name = _name,
        users.username = _username,
        users.password = sha2(_password, 256),
        users.role = _role;

    commit;
end//
delimiter ;

delimiter //
create or replace procedure login(
    in _username varchar(255),
    in _password varchar(255)
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    if (length(coalesce(_username, '')) < 3) then
        signal sqlstate
            '45000'
        set
            message_text = 'Panjang username minimal 3 karakter';
    end if;

    if (length(_password) < 8) then
        signal sqlstate
            '45000'
        set
            message_text = 'Panjang password minimal 8 karakter';
    end if;

    if not exists(
        select
            1
        from
            users
        where
            username = _username and password = sha2(_password, 256)
    ) then
        signal sqlstate
            '45000'
        set
            message_text = 'Username atau password salah';
    end if;

    select
        id,
        name,
        username,
        role
    from
        users
    where
        username = _username and password = sha2(_password, 256);

    commit;
end//
delimiter ;

create or replace view view_users
    as
select
    id,
    name,
    username
from
    users;

delimiter //
create or replace procedure get_users()
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    select
        *
    from
        view_users;

    commit;
end //
delimiter ;

delimiter //
create or replace procedure search_user_by_name(
    in _name varchar(255)
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    select
        id,
        name,
        username,
        role
    from
        users
    where
        name like concat('%', _name, '%');

    commit;
end //
delimiter ;

delimiter //
create or replace procedure search_user_by_username(
    in _username varchar(255)
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    select
        id,
        name,
        username,
        role
    from
        users
    where
        username like concat('%', _username, '%');

    commit;
end //
delimiter ;

-- PUT
delimiter //
create or replace procedure edit_user(
    in _id int,
    in _name varchar(255),
    in _username varchar(255),
    in _password varchar(255),
    in _role enum('user', 'admin', 'superadmin')
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    update
        users
    set
        name = coalesce(_name, name),
        username = coalesce(_username, username),
        password = sha2(_password, 256),
        role = coalesce(_role, role)
    where
        id = _id;

    select
        name,
        username,
        role
    from
        users
    where
        id = _id;

    commit;
end //
delimiter ;

delimiter //
create or replace procedure delete_user(
    in _id int
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    delete from
        users
    where
        id = _id;

    commit;
end //
delimiter ;
-- ----------------- Procedures
