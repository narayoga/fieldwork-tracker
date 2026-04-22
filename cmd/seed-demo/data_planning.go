package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
)

type planningRow struct {
	STO               string
	NamaLop           string
	StatusMicrodemand string
	StatusLop         string
	Keterangan        string
}

var planningRows = []planningRow{
	// --- BPP (Balikpapan Kota) --- 12 records
	{"BPP", "LOP-BPP-001 Klandasan Ilir", "Approved", "Go", "Area komersial padat"},
	{"BPP", "LOP-BPP-002 Klandasan Ulu", "Approved", "Go", "Perumahan"},
	{"BPP", "LOP-BPP-003 Prapatan Blok A", "Approved", "Go", "Ruko"},
	{"BPP", "LOP-BPP-004 Prapatan Blok B", "Approved", "Go", "Ruko + perumahan"},
	{"BPP", "LOP-BPP-005 Damai Bahagia", "Approved", "Go", "Perumahan baru"},
	{"BPP", "LOP-BPP-006 Gunung Sari Ilir", "Approved", "Go", "Perumahan lama"},
	{"BPP", "LOP-BPP-007 Gunung Sari Ulu", "Approved", "Go", "Campuran"},
	{"BPP", "LOP-BPP-008 Telaga Sari", "Approved", "Go", "Perumahan"},
	{"BPP", "LOP-BPP-009 Karang Rejo", "Approved", "Go", "Perumahan"},
	{"BPP", "LOP-BPP-010 Karang Jati", "Approved", "Go", "Perumahan padat"},
	{"BPP", "LOP-BPP-011 Mekar Sari", "Ongoing", "", "Microdemand dalam review"},
	{"BPP", "LOP-BPP-012 Sumber Rejo", "Rejected", "", "Demand di bawah target"},

	// --- BPU (Balikpapan Utara) --- 8 records
	{"BPU", "LOP-BPU-001 Batu Ampar", "Approved", "Go", "Perumahan berkembang"},
	{"BPU", "LOP-BPU-002 Karang Joang", "Approved", "Go", "Dekat kampus"},
	{"BPU", "LOP-BPU-003 Muara Rapak", "Approved", "Go", "Campuran"},
	{"BPU", "LOP-BPU-004 Gunung Samarinda", "Approved", "Go", "Perumahan"},
	{"BPU", "LOP-BPU-005 Gunung Samarinda Baru", "Approved", "Go", "Cluster baru"},
	{"BPU", "LOP-BPU-006 Graha Indah", "Approved", "Go", "Perumahan elit"},
	{"BPU", "LOP-BPU-007 Kariangau", "Approved", "No Go", "Area remote, ROI rendah"},
	{"BPU", "LOP-BPU-008 Margo Mulyo", "Ongoing", "", "Survey lapangan belum final"},

	// --- BPS (Balikpapan Selatan) --- 6 records
	{"BPS", "LOP-BPS-001 Sepinggan", "Approved", "Go", "Dekat bandara"},
	{"BPS", "LOP-BPS-002 Sepinggan Baru", "Approved", "Go", "Perumahan baru"},
	{"BPS", "LOP-BPS-003 Gunung Bahagia", "Approved", "Go", "Perumahan"},
	{"BPS", "LOP-BPS-004 Sungai Nangka", "Approved", "Go", "Campuran"},
	{"BPS", "LOP-BPS-005 Damai Baru", "Ongoing", "", "Menunggu approval kelurahan"},
	{"BPS", "LOP-BPS-006 Sepinggan Raya", "Rejected", "", "Overlap dengan LoP lain"},

	// --- BPT (Balikpapan Timur) --- 4 records
	{"BPT", "LOP-BPT-001 Manggar", "Approved", "Go", "Perumahan pesisir"},
	{"BPT", "LOP-BPT-002 Manggar Baru", "Approved", "Go", "Cluster baru"},
	{"BPT", "LOP-BPT-003 Teritip", "Approved", "Go", "Perumahan"},
	{"BPT", "LOP-BPT-004 Lamaru", "Ongoing", "", "Review demand"},
}

func seedPlanning(tx *sql.Tx) error {
	stmt, err := tx.Prepare(
		`INSERT INTO planning (project, tahun, sto, nama_lop, status_microdemand, status_lop, keterangan)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
	)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, p := range planningRows {
		if _, err := stmt.Exec(
			"Fiber Deployment Balikpapan 2026", "2026",
			p.STO, p.NamaLop, p.StatusMicrodemand, p.StatusLop, p.Keterangan,
		); err != nil {
			return err
		}
	}
	return nil
}

var stoCenter = map[string][2]float64{
	"BPP": {-1.2654, 116.8312},
	"BPU": {-1.2015, 116.8520},
	"BPS": {-1.2846, 116.8729},
	"BPT": {-1.2405, 116.9105},
}

func seedPlanningOdp(tx *sql.Tx) error {
	stmt, err := tx.Prepare(
		`INSERT INTO planning_odp (planning_id, koordinat) VALUES (?, ?)`,
	)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for i, p := range planningRows {
		// lookup planning.id by nama_lop
		var planningID int
		err := tx.QueryRow(
			"SELECT id FROM planning WHERE nama_lop = ?", p.NamaLop,
		).Scan(&planningID)
		if err != nil {
			return fmt.Errorf("lookup id for %s: %w", p.NamaLop, err)
		}

		center := stoCenter[p.STO]
		offsetLat := float64((i%7)-3) * 0.0015
		offsetLng := float64((i%5)-2) * 0.0018
		lat := center[0] + offsetLat
		lng := center[1] + offsetLng

		coords := []string{fmt.Sprintf("%.6f,%.6f", lat, lng)}
		if i%3 == 0 {
			coords = append(coords, fmt.Sprintf("%.6f,%.6f", lat+0.0008, lng+0.0010))
		}

		coordJSON, err := json.Marshal(coords)
		if err != nil {
			return err
		}
		if _, err := stmt.Exec(planningID, string(coordJSON)); err != nil {
			return err
		}
	}
	return nil
}
