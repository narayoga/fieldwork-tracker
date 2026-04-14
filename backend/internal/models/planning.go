package models

import "time"

type Planning struct {
	ID                int       `json:"id"`
	Project           string    `json:"project"`
	Tahun             string    `json:"tahun"`
	STO               string    `json:"sto"`
	NamaLop           string    `json:"nama_lop"`
	StatusMicrodemand string    `json:"status_microdemand"`
	StatusLop         string    `json:"status_lop"`
	Keterangan        string    `json:"keterangan"`
	CreatedAt         time.Time `json:"created_at"`
}

type PlanningOdp struct {
	ID        int      `json:"id"`
	NamaLop   string   `json:"nama_lop"`
	Koordinat []string `json:"koordinat"`
}

type PlanningOdpRequest struct {
	NamaLop   string   `json:"nama_lop" binding:"required"`
	Koordinat []string `json:"koordinat" binding:"required"`
}

type PlanningUpdateRequest struct {
	Project           string `json:"project"`
	Tahun             string `json:"tahun"`
	STO               string `json:"sto"`
	NamaLop           string `json:"nama_lop" binding:"required"`
	NamaLopBaru       string `json:"nama_lop_baru"`
	StatusMicrodemand string `json:"status_microdemand"`
	StatusLop         string `json:"status_lop"`
	Keterangan        string `json:"keterangan"`
}
