// Package main seeds demo data for investor presentation.
//
// Story: Telkom fiber deployment in Balikpapan (Kalimantan Timur).
// - 3 Mitra vendors (subcon)
// - 30 Planning records across 4 STOs (BPP, BPU, BPS, BPT)
// - 20 Construction records (subset of approved planning)
// - 12 ODP golive records (from fully completed construction)
// - 2 total failure records for realism (1 dropped at planning, 1 at construction)
//
// Idempotent: TRUNCATE all demo tables before inserting. Does NOT touch `users`
// (that is managed by cmd/seed-roles).
//
// Deterministic: uses fixed random seed so every run yields identical data.
//
// Run:
//   cd backend
//   go run ./cmd/seed-demo
package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	rand.Seed(42)

	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using environment variables")
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("ping db: %v", err)
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatalf("begin tx: %v", err)
	}

	steps := []struct {
		name string
		fn   func(*sql.Tx) error
	}{
		{"truncate demo tables", truncateAll},
		{"seed mitra (3 vendors)", seedMitra},
		{"seed planning (30 LoPs)", seedPlanning},
		{"seed planning_odp (coordinates)", seedPlanningOdp},
		{"seed construction (20 records)", seedConstruction},
		{"seed odp (12 golive)", seedOdp},
	}

	for _, s := range steps {
		if err := s.fn(tx); err != nil {
			_ = tx.Rollback()
			log.Fatalf("step %q failed: %v", s.name, err)
		}
		fmt.Printf("  OK  %s\n", s.name)
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("commit: %v", err)
	}

	fmt.Println("\ndemo data seeded successfully")
	printSummary(db)
}

func truncateAll(tx *sql.Tx) error {
	// Order: child tables first, but CASCADE covers that. users is preserved.
	_, err := tx.Exec(`
		TRUNCATE TABLE
			planning_odp,
			planning,
			construction_photos,
			construction,
			odp,
			mitra
		RESTART IDENTITY CASCADE
	`)
	return err
}

func printSummary(db *sql.DB) {
	tables := []string{"mitra", "planning", "planning_odp", "construction", "odp"}
	fmt.Println("\nrow counts:")
	for _, t := range tables {
		var n int
		if err := db.QueryRow("SELECT COUNT(*) FROM " + t).Scan(&n); err != nil {
			fmt.Printf("  %s: error (%v)\n", t, err)
			continue
		}
		fmt.Printf("  %-15s %d\n", t, n)
	}
}
