package repository

import (
	"pas-backend/internal/config"
	"pas-backend/internal/models"
)

func GetPlanningRecap() ([]models.PlanningRecap, error) {
	rows, err := config.DB.Query(`
		SELECT
			sto,
			COUNT(*) as jumlah_lop,
			0 as jumlah_odp,
			COUNT(*) FILTER (WHERE status_microdemand = 'Ongoing') as ongoing,
			COUNT(*) FILTER (WHERE status_microdemand = 'Rejected') as rejected,
			COUNT(*) FILTER (WHERE status_microdemand = 'Approved') as approved,
			COUNT(*) FILTER (WHERE status_lop = 'Go') as status_go,
			COUNT(*) FILTER (WHERE status_lop = 'No Go') as status_no_go
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
			COUNT(*) FILTER (WHERE preparing IS NOT NULL AND preparing != '') as preparing,
			COUNT(*) FILTER (WHERE construction IS NOT NULL AND construction != '') as construction,
			COUNT(*) FILTER (WHERE closing IS NOT NULL AND closing != '') as closing,
			COUNT(*) FILTER (WHERE status_lop = 'Aktif') as aktif,
			COUNT(*) FILTER (WHERE status_lop = 'Drop') as drop
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
