grant all privileges on database skyspecs_db to skyspecs_user;

create table skyspecs_user (
    id serial primary key,
    username varchar(50) not null,
    unique(username)
);

create table skyspecs_user_gist (
    id serial primary key,
    gist_id varchar(100) not null,
    is_favorite boolean not null default false,
    user_id int,
    constraint fk_user
      foreign key(user_id)
         references skyspecs_user(id),
    unique(gist_id, user_id)
);
