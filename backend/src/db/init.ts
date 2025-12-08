import fs from "fs";
import path from "path";
import pool from "../pool";

export async function initDatabase(): Promise<void> {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");
    await pool.query(sql);
    console.log("Database initialized");
    
    // Run migration to add image_url column if table already exists
    const migratePath = path.join(__dirname, "migrate-add-image.sql");
    if (fs.existsSync(migratePath)) {
      const migrateSql = fs.readFileSync(migratePath, "utf-8");
      await pool.query(migrateSql);
      console.log("Database migration completed");
    }
  } catch (err) {
    console.error("DB init error:", err);
    throw err;
  }
}

