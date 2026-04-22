package main

import (
	"database/sql"
	"fmt"
	"time"
)

// 12 ODP records — one per "all Done" construction.
// tgl_golive spread over the last 60 days for a realistic timeline.
// distribusi mix: majority 1:8 (standard), some 1:16 (dense), one 1:4 (low density).

var distribusiPattern = []string{"1:8", "1:8", "1:8", "1:16", "1:8", "1:8", "1:8", "1:16", "1:8", "1:4", "1:8", "1:8"}

func seedOdp(tx *sql.Tx) error {
	// Pick the constructionRows where all stages are Done.
	var doneRows []constructionRow
	for _, c := range constructionRows {
		if c.Preparing == stageDone && c.Construction == stageDone && c.Closing == stageDone {
			doneRows = append(doneRows, c)
		}
	}

	stmt, err := tx.Prepare(
		`INSERT INTO odp (nama_lop, nama_odp, tgl_golive, distribusi) VALUES (?, ?, ?, ?)`,
	)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// golive dates: start from 60 days ago, step ~5 days forward
	base := time.Now().AddDate(0, 0, -60)

	for i, c := range doneRows {
		odpName := fmt.Sprintf("ODP-%s-%03d-A", c.STO, i+1)
		golive := base.AddDate(0, 0, i*5).Format("2006-01-02")

		dist := "1:8"
		if i < len(distribusiPattern) {
			dist = distribusiPattern[i]
		}

		if _, err := stmt.Exec(c.NamaLop, odpName, golive, dist); err != nil {
			return err
		}
	}
	return nil
}
