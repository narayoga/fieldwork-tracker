package handler

import (
	"log"
	"net/http"
	"sync"

	"pas-backend/pkg/config"
	"pas-backend/pkg/router"

	"github.com/gin-gonic/gin"
)

var (
	app     *gin.Engine
	initErr error
	initMu  sync.Mutex
)

func initApp() error {
	initMu.Lock()
	defer initMu.Unlock()

	if app != nil && initErr == nil {
		return nil
	}

	gin.SetMode(gin.ReleaseMode)
	if err := config.ConnectDB(); err != nil {
		initErr = err
		log.Println("init error:", err)
		return err
	}
	app = router.SetupRouter()
	initErr = nil
	return nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if err := initApp(); err != nil {
		http.Error(w, "service unavailable: "+err.Error(), http.StatusServiceUnavailable)
		return
	}
	app.ServeHTTP(w, r)
}
