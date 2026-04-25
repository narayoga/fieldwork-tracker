package repository

import (
	"pas-backend/pkg/config"
	"pas-backend/pkg/models"
)

func GetPlanningRecap() ([]models.PlanningRecap, error) {
	rows, err := config.DB.Query(`
		SELECT
			sto,
			COUNT(*) as jumlah_lop,
			0 as jumlah_odp,
			SUM(CASE WHEN status_microdemand = 'Ongoing'  THEN 1 ELSE 0 END) as ongoing,
			SUM(CASE WHEN status_microdemand = 'Rejected' THEN 1 ELSE 0 END) as rejected,
			SUM(CASE WHEN status_microdemand = 'Approved' THEN 1 ELSE 0 END) as approved,
			SUM(CASE WHEN status_lop = 'Go'              THEN 1 ELSE 0 END) as status_go,
			SUM(CASE WHEN status_lop = 'No Go'           THEN 1 ELSE 0 END) as status_no_go
		FROM planning
		GROUP BY sto
		ORDER BY sto
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.PlanningRecap
	for rows.Next() {
		var r models.PlanningRecap
		if err := rows.Scan(&r.STO, &r.JumlahLop, &r.JumlahOdp, &r.Ongoing, &r.Rejected,
			&r.Approved, &r.StatusGo, &r.StatusNoGo); err != nil {
			return nil, err
		}
		items = append(items, r)
	}
	return items, nil
}

func GetConstructionRecap() ([]models.ConstructionRecap, error) {
	rows, err := config.DB.Query(`
		SELECT
			sto,
			COUNT(*) as jumlah_odp,
			SUM(CASE WHEN preparing   IS NOT NULL AND preparing   != '' THEN 1 ELSE 0 END) as preparing,
			SUM(CASE WHEN construction IS NOT NULL AND construction != '' THEN 1 ELSE 0 END) as construction,
			SUM(CASE WHEN closing     IS NOT NULL AND closing     != '' THEN 1 ELSE 0 END) as closing,
			SUM(CASE WHEN status_lop = 'Aktif' THEN 1 ELSE 0 END) as aktif,
			SUM(CASE WHEN status_lop = 'Drop'  THEN 1 ELSE 0 END) as drop_count
		FROM construction
		GROUP BY sto
		ORDER BY sto
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.ConstructionRecap
	for rows.Next() {
		var r models.ConstructionRecap
		if err := rows.Scan(&r.STO, &r.JumlahOdp, &r.Preparing, &r.Construction,
			&r.Closing, &r.Aktif, &r.Drop); err != nil {
			return nil, err
		}
		items = append(items, r)
	}
	return items, nil
}
