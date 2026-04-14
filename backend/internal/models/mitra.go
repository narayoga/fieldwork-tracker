package models

import "time"

type Mitra struct {
	ID       int       `json:"id"`
	Subcon   string    `json:"subcon"`
	Manpower string    `json:"manpower"`
	Jointer  string    `json:"jointer"`
	Mandor   string    `json:"mandor"`
	CreatedAt time.Time `json:"created_at"`
}
