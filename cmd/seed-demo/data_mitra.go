package main

import "database/sql"

// 3 Mitra vendors operating in Balikpapan region.
// Numbers reflect realistic subcon team sizes for fiber deployment.
var mitraRows = []struct {
	Subcon   string
	Manpower string
	Jointer  string
	Mandor   string
}{
	{"PT Fiber Nusantara Timur", "45", "12", "4"},
	{"CV Balikpapan Jaya", "28", "8", "3"},
	{"PT Borneo Optik", "35", "10", "3"},
}

func seedMitra(tx *sql.Tx) error {
	stmt, err := tx.Prepare(
		`INSERT INTO mitra (subcon, manpower, jointer, mandor) VALUES (?, ?, ?, ?)`,
	)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, m := range mitraRows {
		if _, err := stmt.Exec(m.Subcon, m.Manpower, m.Jointer, m.Mandor); err != nil {
			return err
		}
	}
	return nil
}
