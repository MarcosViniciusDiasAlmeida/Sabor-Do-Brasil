CREATE DATABASE IF NOT EXISTS meubanco;
USE meubanco;

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email varchar(100) NOT NULL,
    senha varchar(50) NOT NULL
);