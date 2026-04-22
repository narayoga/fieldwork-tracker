package main

import (
	"database/sql"
	"fmt"
)

// 20 Construction records — subset of planning's 23 "Go" LoPs.
// Lifecycle distribution shows a realistic funnel:
//   - 12 "all Done"                   → will have matching ODP golive
//   - 4  "construction in progress"   → preparing Done, construction On Progress
//   - 2  "preparing Done, construction pending"
//   - 1  "baru mulai"                 → preparing Pending
//   - 1  "Drop"                       → stopped mid-construction (the 2nd failure)
//
// Total Aktif: 19, Drop: 1
const (
	stageDone       = "Done"
	stageOnProgress = "On Progress"
	stagePending    = "Pending"
	stageHalted     = "-"
)

type constructionRow struct {
	IDLop        string
	NamaLop      string
	STO          string
	OdpPlan      string // planned ODP count
	OdpActual    string // actual ODP installed (only when Done)
	NamaWaspang  string
	MitraUnderTa string
	Preparing    string
	Construction string
	Closing      string
	StatusLop    string // Aktif | Drop
	Keterangan   string
}

var waspangList = []string{
	"Budi Santoso",
	"Agus Wijaya",
	"Dedi Rahman",
	"Rizki Pratama",
	"Hendra Setiawan",
}

var mitraNames = []string{
	"PT Fiber Nusantara Timur",
	"CV Balikpapan Jaya",
	"PT Borneo Optik",
}

// Helper: build a construction record. Assignment of waspang and mitra
// uses modulo so it stays deterministic.
func mkConstruction(i int, idLop, namaLop, sto, odpPlan, odpActual,
	prep, con, close, status, ket string) constructionRow {
	return constructionRow{
		IDLop:        idLop,
		NamaLop:      namaLop,
		STO:          sto,
		OdpPlan:      odpPlan,
		OdpActual:    odpActual,
		NamaWaspang:  waspangList[i%len(waspangList)],
		MitraUnderTa: mitraNames[i%len(mitraNames)],
		Preparing:    prep,
		Construction: con,
		Closing:      close,
		StatusLop:    status,
		Keterangan:   ket,
	}
}

// constructionRows is populated in init() by pulling from planningRows.
// We reference the planningRow slice so nama_lop stays consistent.
var constructionRows []constructionRow

func init() {
	// Indices into planningRows that move to construction (20 of the 23 "Go").
	// We skip 3 "Go" records (Karang Rejo, Karang Jati, Telaga Sari)
	// to represent LoPs approved but not yet started — realistic backlog.
	//
	// Mapping: each entry is {planningIdx, lifecycle}
	// lifecycle codes:
	//   "done"     : all stages Done, ODP installed
	//   "onprog"   : preparing Done, construction On Progress, closing Pending
	//   "prepdone" : preparing Done, construction Pending, closing Pending
	//   "starting" : preparing Pending
	//   "drop"     : dropped mid-construction

	type assign struct {
		idx       int
		lifecycle string
	}

	assignments := []assign{
		// 12 "all Done" — will have matching ODP
		{0, "done"},  // LOP-BPP-001 Klandasan Ilir
		{1, "done"},  // LOP-BPP-002 Klandasan Ulu
		{2, "done"},  // LOP-BPP-003 Prapatan Blok A
		{3, "done"},  // LOP-BPP-004 Prapatan Blok B
		{4, "done"},  // LOP-BPP-005 Damai Bahagia
		{5, "done"},  // LOP-BPP-006 Gunung Sari Ilir
		{12, "done"}, // LOP-BPU-001 Batu Ampar
		{13, "done"}, // LOP-BPU-002 Karang Joang
		{14, "done"}, // LOP-BPU-003 Muara Rapak
		{15, "done"}, // LOP-BPU-004 Gunung Samarinda
		{20, "done"}, // LOP-BPS-001 Sepinggan
		{21, "done"}, // LOP-BPS-002 Sepinggan Baru

		// 4 "construction in progress"
		{6, "onprog"},  // LOP-BPP-007 Gunung Sari Ulu
		{16, "onprog"}, // LOP-BPU-005 Gunung Samarinda Baru
		{17, "onprog"}, // LOP-BPU-006 Graha Indah
		{22, "onprog"}, // LOP-BPS-003 Gunung Bahagia

		// 2 "preparing Done, construction pending"
		{23, "prepdone"}, // LOP-BPS-004 Sungai Nangka
		{26, "prepdone"}, // LOP-BPT-001 Manggar

		// 1 "baru mulai"
		{27, "starting"}, // LOP-BPT-002 Manggar Baru

		// 1 "Drop" — the 2nd failure, stopped mid-construction
		{28, "drop"}, // LOP-BPT-003 Teritip
	}

	for i, a := range assignments {
		p := planningRows[a.idx]
		idLop := fmt.Sprintf("INAID%06d", 100+i+1)
		odpPlan := "2"
		odpActual := ""
		var prep, con, clos, status, ket string

		switch a.lifecycle {
		case "done":
			prep, con, clos = stageDone, stageDone, stageDone
			odpActual = "2"
			status = "Aktif"
			ket = "Golive complete"
		case "onprog":
			prep, con, clos = stageDone, stageOnProgress, stagePending
			status = "Aktif"
			ket = "Penarikan kabel berjalan"
		case "prepdone":
			prep, con, clos = stageDone, stagePending, stagePending
			status = "Aktif"
			ket = "Material siap, menunggu tim lapangan"
		case "starting":
			prep, con, clos = stagePending, stagePending, stagePending
			status = "Aktif"
			ket = "Survey awal"
		case "drop":
			prep, con, clos = stageDone, stageHalted, stageHalted
			status = "Drop"
			ket = "Permit warga ditolak, konstruksi dihentikan"
		}

		constructionRows = append(constructionRows,
			mkConstruction(i, idLop, p.NamaLop, p.STO, odpPlan, odpActual,
				prep, con, clos, status, ket))
	}
}

func seedConstruction(tx *sql.Tx) error {
	stmt, err := tx.Prepare(
		`INSERT INTO construction
		 (id_lop, nama_lop, sto, odp_plan, odp_actual, nama_waspang, mitra_under_ta,
		  preparing, construction, closing, status_lop, keterangan)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, c := range constructionRows {
		if _, err := stmt.Exec(
			c.IDLop, c.NamaLop, c.STO, c.OdpPlan, c.OdpActual,
			c.NamaWaspang, c.MitraUnderTa,
			c.Preparing, c.Construction, c.Closing,
			c.StatusLop, c.Keterangan,
		); err != nil {
			return err
		}
	}
	return nil
}
