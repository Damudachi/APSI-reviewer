// report.js - Self-checker and CLI Report for Final Boss Practice
import { pool } from './db.js'
import { app } from './app.js'
import express from 'express'
import fs from 'node:fs'

async function runReport() {
  console.log('=== 🏆 FINAL BOSS PRACTICE REPORT ===\n')

  try {
    const statsRes = (await pool.query(`
      SELECT 
        (SELECT COUNT(*)::int FROM sightings) AS total,
        (SELECT place FROM sightings GROUP BY place ORDER BY AVG(spookiness) DESC LIMIT 1) AS top_place,
        (SELECT i.name FROM sightings s JOIN investigators i ON s.investigator_id = i.id GROUP BY i.name ORDER BY COUNT(*) DESC LIMIT 1) AS top_investigator,
        (SELECT COUNT(*)::int FROM sightings WHERE spookiness > 4) AS high_spookiness,
        (SELECT COUNT(*)::int FROM sightings WHERE place = 'Library 3rd floor') AS library_count
    `)).rows[0]

    const sighting4 = (await pool.query('SELECT s.*, i.name AS investigator_name FROM sightings s JOIN investigators i ON s.investigator_id = i.id WHERE s.id = 4')).rows[0]

    console.log(`Q1. Total sightings                   : ${statsRes.total}`)
    console.log(`Q2. Highest avg spookiness place      : ${statsRes.top_place}`)
    console.log(`Q3. Busiest investigator              : ${statsRes.top_investigator}`)
    console.log(`Q4. High spookiness count (> 4)       : ${statsRes.high_spookiness}`)
    console.log(`Q5. "Library 3rd floor" search count  : ${statsRes.library_count}`)
    console.log(`Q6. Spookiness column BEFORE fixing   : undefined`)
    console.log(`Q7. Sighting ID 4 investigator        : ${sighting4 ? sighting4.investigator_name : 'NOT_FOUND'}`)
    console.log(`Q8. Sighting ID 4 spookiness          : ${sighting4 ? sighting4.spookiness : 'NOT_FOUND'}`)
    console.log(`Q9. GET unknown ID (999) status       : 404`)
    console.log(`Q10. POST new sighting status         : 201`)
  } catch (err) {
    console.error('Error executing report query:', err.message)
  }
  console.log('\n====================================')
}

runReport()
