package repository

import (
	"encoding/json"
	"pas-backend/internal/config"
	"pas-backend/internal/models"
)

func CreatePlanning(p models.Planning) error {
	_, err := config.DB.Exec(
		`INSERT INTO planning (project, tahun, sto, nama_lop, status_microdemand, status_lop, keterangan)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		p.Project, p.Tahun, p.STO, p.NamaLop, p.StatusMicrodemand, p.StatusLop, p.Keterangan,
	)
	return err
}

func ListPlanning() ([]models.Planning, error) {
	rows, err := config.DB.Query(
		"SELECT id, project, tahun, sto, nama_lop, status_microdemand, status_lop, keterangan FROM planning ORDER BY id",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Planning
	for rows.Next() {
		var p models.Planning
		if err := rows.Scan(&p.ID, &p.Project, &p.Tahun, &p.STO, &p.NamaLop, &p.StatusMicrodemand, &p.StatusLop, &p.Keterangan); err != nil {
			return nil, err
		}
		items = append(items, p)
	}
	return items, nil
}

func UpdatePlanning(req models.PlanningUpdateRequest) error {
	_, err := config.DB.Exec(
		`UPDATE planning SET project=?, tahun=?, sto=?, nama_lop=?, status_microdemand=?, status_lop=?, keterangan=?
		 WHERE nama_lop=?`,
		req.Project, req.Tahun, req.STO, req.NamaLopBaru, req.StatusMicrodemand, req.StatusLop, req.Keterangan, req.NamaLop,
	)
	return err
}

func SaveOdpCoords(req models.PlanningOdpRequest) error {
	var planningID int
	err := config.DB.QueryRow(
		"SELECT id FROM planning WHERE nama_lop = ?", req.NamaLop,
	).Scan(&planningID)
	if err != nil {
		return err
	}

	coordJSON, err := json.Marshal(req.Koordinat)
	if err != nil {
		return err
	}

	_, _ = config.DB.Exec("DELETE FROM planning_odp WHERE planning_id = ?", planningID)
	_, err = config.DB.Exec(
		"INSERT INTO planning_odp (planning_id, koordinat) VALUES (?, ?)",
		planningID, string(coordJSON),
	)
	return err
}

func GetOdpCoords(namaLop string) (*models.PlanningOdp, error) {
	odp := &models.PlanningOdp{}
	var coordJSON string
	err := config.DB.QueryRow(`
		SELECT po.id, p.nama_lop, po.koordinat
		FROM planning_odp po
		JOIN planning p ON po.planning_id = p.id
		WHERE p.nama_lop = ?`, namaLop,
	).Scan(&odp.ID, &odp.NamaLop, &coordJSON)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal([]byte(coordJSON), &odp.Koordinat); err != nil {
		return nil, err
	}
	return odp, nil
}
