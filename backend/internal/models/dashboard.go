package models

type PlanningRecap struct {
	STO         string `json:"sto"`
	JumlahLop   int    `json:"jumlah_lop"`
	JumlahOdp   int    `json:"jumlah_odp"`
	Ongoing     int    `json:"ongoing"`
	Rejected    int    `json:"rejected"`
	Approved    int    `json:"approved"`
	StatusGo    int    `json:"status_go"`
	StatusNoGo  int    `json:"status_no_go"`
}

type ConstructionRecap struct {
	STO          string `json:"sto"`
	JumlahOdp    int    `json:"jumlah_odp"`
	Preparing    int    `json:"preparing"`
	Construction int    `json:"construction"`
	Closing      int    `json:"closing"`
	Aktif        int    `json:"aktif"`
	Drop         int    `json:"drop"`
}
