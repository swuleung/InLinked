/*
    IMPORTANT: There is no MySql connector for 8.0 which uses a new encryption scheme for the password, so endpoints wil crash
    Run this before running the app
*/
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';