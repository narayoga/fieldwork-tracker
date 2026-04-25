package repository

import (
	"pas-backend/pkg/config"
	"pas-backend/pkg/models"
)

func CreateMitra(m models.Mitra) error {
	_, err := config.DB.Exec(
		"INSERT INTO mitra (subcon, manpower, jointer, mandor) VALUES (?, ?, ?, ?)",
		m.Subcon, m.Manpower, m.Jointer, m.Mandor,
	)
	return err
}

func ListMitra() ([]models.Mitra, error) {
	rows, err := config.DB.Query("SELECT id, subcon, manpower, jointer, mandor FROM mitra ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Mitra
	for rows.Next() {
		var m models.Mitra
		if err := rows.Scan(&m.ID, &m.Subcon, &m.Manpower, &m.Jointer, &m.Mandor); err != nil {
			return nil, err
		}
		items = append(items, m)
	}
	return items, nil
}
