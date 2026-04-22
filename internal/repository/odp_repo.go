package repository

import (
	"pas-backend/internal/config"
	"pas-backend/internal/models"
)

func CreateOdp(o models.Odp) error {
	_, err := config.DB.Exec(
		"INSERT INTO odp (nama_lop, nama_odp, tgl_golive, distribusi) VALUES (?, ?, ?, ?)",
		o.NamaLop, o.NamaOdp, o.TglGolive, o.Distribusi,
	)
	return err
}

func ListOdp() ([]models.Odp, error) {
	rows, err := config.DB.Query(
		"SELECT id, nama_lop, nama_odp, tgl_golive, distribusi FROM odp ORDER BY id",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Odp
	for rows.Next() {
		var o models.Odp
		if err := rows.Scan(&o.ID, &o.NamaLop, &o.NamaOdp, &o.TglGolive, &o.Distribusi); err != nil {
			return nil, err
		}
		items = append(items, o)
	}
	return items, nil
}
