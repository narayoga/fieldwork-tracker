package repository

import (
	"pas-backend/internal/config"
	"pas-backend/internal/models"
)

func CreateConstruction(c models.Construction) error {
	_, err := config.DB.Exec(
		`INSERT INTO construction (id_lop, nama_lop, sto, odp_plan, nama_waspang, mitra_under_ta, preparing, construction, closing, status_lop)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
		`UPDATE construction SET nama_lop=$1, sto=$2, nama_waspang=$3, mitra_under_ta=$4,
		        preparing=$5, construction=$6, closing=$7, status_lop=$8, odp_actual=$9, keterangan=$10
		 WHERE id_lop=$11`,
		c.NamaLop, c.STO, c.NamaWaspang, c.MitraUnderTa, c.Preparing, c.Construction,
		c.Closing, c.StatusLop, c.OdpActual, c.Keterangan, c.IDLop,
	)
	return err
}

func SavePhoto(photo models.ConstructionPhoto) error {
	_, err := config.DB.Exec(
		"INSERT INTO construction_photos (nama_lop, step, lokasi) VALUES ($1, $2, $3)",
		photo.NamaLop, photo.Step, photo.Lokasi,
	)
	return err
}

func GetPhotos(namaLop string) ([]models.ConstructionPhoto, error) {
	rows, err := config.DB.Query(
		"SELECT id, nama_lop, step, lokasi FROM construction_photos WHERE nama_lop = $1 ORDER BY id",
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
