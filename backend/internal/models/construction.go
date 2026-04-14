package models

import "time"

type Construction struct {
	ID           int       `json:"id"`
	IDLop        string    `json:"id_lop"`
	NamaLop      string    `json:"nama_lop"`
	STO          string    `json:"sto"`
	OdpPlan      string    `json:"odp_plan"`
	OdpActual    string    `json:"odp_actual"`
	NamaWaspang  string    `json:"nama_waspang"`
	MitraUnderTa string    `json:"mitra_under_ta"`
	Preparing    string    `json:"preparing"`
	Construction string    `json:"construction"`
	Closing      string    `json:"closing"`
	StatusLop    string    `json:"status_lop"`
	Keterangan   string    `json:"keterangan"`
	CreatedAt    time.Time `json:"created_at"`
}

type ConstructionPhoto struct {
	ID         int       `json:"id"`
	NamaLop    string    `json:"nama_lop"`
	Step       string    `json:"step"`
	Lokasi     string    `json:"lokasi"`
	UploadedAt time.Time `json:"uploaded_at"`
}
