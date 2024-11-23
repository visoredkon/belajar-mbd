create or replace database garasi_ku;
use garasi_ku;

-- ----------------- Tables
create or replace table users (
    id int primary key auto_increment,
    name varchar(255) not null,
    username varchar(255) unique not null,
    password varchar(255) not null,
    is_admin boolean not null
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
    in _is_admin boolean
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
        users.is_admin = _is_admin;

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

    if (length(_username) <= 3) then
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
        is_admin
    from
        users
    where
        username = _username and password = sha2(_password, 256);

    commit;
end//
delimiter ;
-- ----------------- Procedures
