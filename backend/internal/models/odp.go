package models

import "time"

type Odp struct {
	ID         int       `json:"id"`
	NamaLop    string    `json:"nama_lop"`
	NamaOdp    string    `json:"nama_odp"`
	TglGolive  string    `json:"tgl_golive"`
	Distribusi string    `json:"distribusi"`
	CreatedAt  time.Time `json:"created_at"`
}
