package repository

import (
	"pas-backend/internal/config"
	"pas-backend/internal/models"
)

func CreateConstruction(c models.Construction) error {
	_, err := config.DB.Exec(
		`INSERT INTO construction (id_lop, nama_lop, sto, odp_plan, nama_waspang, mitra_under_ta, preparing, construction, closing, status_lop)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		c.IDLop, c.NamaLop, c.STO, c.OdpPlan, c.NamaWaspang, c.MitraUnderTa, c.Preparing, c.Construction, c.Closing, c.StatusLop,
	)
	return err
}

func ListConstruction() ([]models.Construction, error) {
	rows, err := config.DB.Query(
		`SELECT id, id_lop, nama_lop, sto, odp_plan, odp_actual, nama_waspang, mitra_under_ta,
		        preparing, construction, closing, status_lop, keterangan
		 FROM construction ORDER BY id`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Construction
	for rows.Next() {
		var c models.Construction
		if err := rows.Scan(&c.ID, &c.IDLop, &c.NamaLop, &c.STO, &c.OdpPlan, &c.OdpActual,
			&c.NamaWaspang, &c.MitraUnderTa, &c.Preparing, &c.Construction, &c.Closing,
			&c.StatusLop, &c.Keterangan); err != nil {
			return nil, err
		}
		items = append(items, c)
	}
	return items, nil
}

func UpdateConstruction(c models.Construction) error {
	_, err := config.DB.Exec(
		`UPDATE construction SET nama_lop=?, sto=?, nama_waspang=?, mitra_under_ta=?,
		        preparing=?, construction=?, closing=?, status_lop=?, odp_actual=?, keterangan=?
		 WHERE id_lop=?`,
		c.NamaLop, c.STO, c.NamaWaspang, c.MitraUnderTa, c.Preparing, c.Construction,
		c.Closing, c.StatusLop, c.OdpActual, c.Keterangan, c.IDLop,
	)
	return err
}

func SavePhoto(photo models.ConstructionPhoto) error {
	_, err := config.DB.Exec(
		"INSERT INTO construction_photos (nama_lop, step, lokasi) VALUES (?, ?, ?)",
		photo.NamaLop, photo.Step, photo.Lokasi,
	)
	return err
}

func GetPhotos(namaLop string) ([]models.ConstructionPhoto, error) {
	rows, err := config.DB.Query(
		"SELECT id, nama_lop, step, lokasi FROM construction_photos WHERE nama_lop = ? ORDER BY id",
		namaLop,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var photos []models.ConstructionPhoto
	for rows.Next() {
		var p models.ConstructionPhoto
		if err := rows.Scan(&p.ID, &p.NamaLop, &p.Step, &p.Lokasi); err != nil {
			return nil, err
		}
		photos = append(photos, p)
	}
	return photos, nil
}
