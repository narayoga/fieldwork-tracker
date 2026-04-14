package repository

import (
	"pas-backend/internal/config"
	"pas-backend/internal/models"

	"github.com/lib/pq"
)

func CreatePlanning(p models.Planning) error {
	_, err := config.DB.Exec(
		`INSERT INTO planning (project, tahun, sto, nama_lop, status_microdemand, status_lop, keterangan)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
		`UPDATE planning SET project=$1, tahun=$2, sto=$3, nama_lop=$4, status_microdemand=$5, status_lop=$6, keterangan=$7
		 WHERE nama_lop=$8`,
		req.Project, req.Tahun, req.STO, req.NamaLopBaru, req.StatusMicrodemand, req.StatusLop, req.Keterangan, req.NamaLop,
	)
	return err
}

func SaveOdpCoords(req models.PlanningOdpRequest) error {
	// Delete existing coords first, then insert new
	_, _ = config.DB.Exec("DELETE FROM planning_odp WHERE nama_lop = $1", req.NamaLop)
	_, err := config.DB.Exec(
		"INSERT INTO planning_odp (nama_lop, koordinat) VALUES ($1, $2)",
		req.NamaLop, pq.Array(req.Koordinat),
	)
	return err
}

func GetOdpCoords(namaLop string) (*models.PlanningOdp, error) {
	odp := &models.PlanningOdp{}
	err := config.DB.QueryRow(
		"SELECT id, nama_lop, koordinat FROM planning_odp WHERE nama_lop = $1", namaLop,
	).Scan(&odp.ID, &odp.NamaLop, pq.Array(&odp.Koordinat))
	if err != nil {
		return nil, err
	}
	return odp, nil
}
