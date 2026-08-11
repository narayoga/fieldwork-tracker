-- MySQL schema for fieldwork-tracker (Hostinger)
-- Run this once in Hostinger phpMyAdmin or MySQL client
-- Database: u216387270_ds_fieldwork

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(50)  NOT NULL,
    handphone   VARCHAR(20)  DEFAULT '',
    is_approved TINYINT(1)   DEFAULT 0,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS planning (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    project             VARCHAR(255) DEFAULT '',
    tahun               VARCHAR(10)  DEFAULT '',
    sto                 VARCHAR(10)  NOT NULL,
    nama_lop            VARCHAR(255) NOT NULL UNIQUE,
    status_microdemand  VARCHAR(50)  DEFAULT '',
    status_lop          VARCHAR(50)  DEFAULT '',
    keterangan          TEXT         DEFAULT '',
    created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS planning_odp (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    planning_id INT          NOT NULL,
    koordinat   JSON         NOT NULL,
    CONSTRAINT fk_planning_odp_planning
        FOREIGN KEY (planning_id) REFERENCES planning(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS construction (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    id_lop          VARCHAR(50)  DEFAULT '',
    nama_lop        VARCHAR(255) DEFAULT '',
    sto             VARCHAR(10)  DEFAULT '',
    odp_plan        VARCHAR(20)  DEFAULT '',
    odp_actual      VARCHAR(20)  DEFAULT '',
    nama_waspang    VARCHAR(100) DEFAULT '',
    mitra_under_ta  VARCHAR(255) DEFAULT '',
    preparing       VARCHAR(50)  DEFAULT '',
    construction    VARCHAR(50)  DEFAULT '',
    closing         VARCHAR(50)  DEFAULT '',
    status_lop      VARCHAR(50)  DEFAULT '',
    keterangan      TEXT         DEFAULT '',
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS construction_photos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nama_lop    VARCHAR(255) DEFAULT '',
    step        VARCHAR(50)  DEFAULT '',
    lokasi      TEXT         DEFAULT '',
    uploaded_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS odp (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nama_lop    VARCHAR(255) DEFAULT '',
    nama_odp    VARCHAR(100) DEFAULT '',
    tgl_golive  VARCHAR(20)  DEFAULT '',
    distribusi  VARCHAR(20)  DEFAULT '',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mitra (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    subcon      VARCHAR(255) DEFAULT '',
    manpower    VARCHAR(20)  DEFAULT '',
    jointer     VARCHAR(20)  DEFAULT '',
    mandor      VARCHAR(20)  DEFAULT '',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
