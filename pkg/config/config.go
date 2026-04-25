package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

// ConnectDB opens a MySQL connection tuned for serverless cold starts.
// Returns error instead of log.Fatal so callers (Vercel handler) stay alive.
func ConnectDB() error {
	if DB != nil {
		if err := DB.Ping(); err == nil {
			return nil // already connected
		}
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true&timeout=5s&readTimeout=10s&writeTimeout=10s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("open db: %w", err)
	}

	// Serverless-friendly pool: small, short-lived
	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(3 * time.Minute)
	db.SetConnMaxIdleTime(1 * time.Minute)

	if err := db.Ping(); err != nil {
		return fmt.Errorf("ping db: %w", err)
	}

	DB = db
	log.Println("✓ Database connected")
	return nil
}
