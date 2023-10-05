const express = require('express');
const mysql = require('mysql2')
const cors = require('cors');
const dotenv=require('dotenv');
dotenv.config();

const app = express()
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    ssl: {
      rejectUnauthorized: false
    }
  });

app.get('/', (re, res)=> {
    return res.json("From Backend!!!");
})

const getLastStudentID = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT MAX(id) AS lastID FROM student';
      db.query(sql, (err, result) => {
        if (err) {
          console.error('Error getting last studentID:', err);
          reject(err);
        } else {
          const lastID = result[0].lastID || 0; // Handle case where there are no records
          resolve(lastID);
        }
      });
    });
  };

  const getLastteacherID = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT MAX(id) AS lastID FROM teacher';
      db.query(sql, (err, result) => {
        if (err) {
          console.error('Error getting last teacherID:', err);
          reject(err);
        } else {
          const lastID = result[0].lastID || 0; // Handle case where there are no records
          resolve(lastID);
        }
      });
    });
  };
  

app.get('/student', (req, res)=> {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/teacher', (req, res)=> {
    const sql = "SELECT * FROM teacher";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/addstudent', async (req, res) => {
    try {
      const lastStudentID = await getLastStudentID();
      const nextStudentID = lastStudentID + 1;
  
      const studentData = {
        id: nextStudentID, // Assign the next studentID
        name: req.body.name,
        roll_number: req.body.rollNo,
        class: req.body.class,
      };
  
      const sql = `INSERT INTO student (id, name, roll_number, class) VALUES (?, ?, ?, ?)`;
      db.query(sql, [studentData.id, studentData.name, studentData.roll_number, studentData.class], (err, data) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ error: 'Error inserting data' });
        }
        return res.json({ message: 'Data inserted successfully' });
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error inserting data' });
    }
  });
  

  app.post('/addteacher', async (req, res) => {
    try {
      const lastteacherID = await getLastteacherID();
      const nextteacherID = lastteacherID + 1;
  
      const TeacherData = {
        id: nextteacherID, // Assign the next teacherID
        name: req.body.name,
        subject: req.body.subject,
        class: req.body.class,
      };
  
      const sql = `INSERT INTO teacher (id, name, subject, class) VALUES (?, ?, ?, ?)`;
      db.query(sql, [TeacherData.id, TeacherData.name, TeacherData.subject, TeacherData.class], (err, data) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ error: 'Error inserting data' });
        }
        return res.json({ message: 'Data inserted successfully' });
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error inserting data' });
    }
  });
  

  app.delete('/student/:id', (req, res) => {
    const studentId = req.params.id;
    const sqlDelete = 'DELETE FROM student WHERE id = ?';
    const sqlSelect = 'SELECT id FROM student ORDER BY id';
  
    // First, delete the record with the given ID
    db.query(sqlDelete, [studentId], (err, result) => {
      if (err) {
        console.error('Error deleting student:', err);
        return res.status(500).json({ error: 'Error deleting student' });
      }
  
      // Then, retrieve the remaining student IDs and update them sequentially
      db.query(sqlSelect, (err, rows) => {
        if (err) {
          console.error('Error selecting student IDs:', err);
          return res.status(500).json({ error: 'Error selecting student IDs' });
        }
  
        // Update the IDs sequentially
        const updatePromises = rows.map((row, index) => {
          const newId = index + 1;
          return new Promise((resolve, reject) => {
            db.query('UPDATE student SET id = ? WHERE id = ?', [newId, row.id], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
  
        // Execute all the update queries in parallel
        Promise.all(updatePromises)
          .then(() => {
            return res.json({ message: 'Student deleted successfully' });
          })
          .catch((err) => {
            console.error('Error updating student IDs:', err);
            return res.status(500).json({ error: 'Error updating student IDs' });
          });
      });
    });
  });

  app.delete('/teacher/:id', (req, res) => {
    const teacherID = req.params.id;
    const sqlDelete = 'DELETE FROM teacher WHERE id = ?';
    const sqlSelect = 'SELECT id FROM teacher ORDER BY id';
  
    // First, delete the record with the given ID
    db.query(sqlDelete, [teacherID], (err, result) => {
      if (err) {
        console.error('Error deleting teacher:', err);
        return res.status(500).json({ error: 'Error deleting teacher' });
      }
  
      // Then, retrieve the remaining teacher IDs and update them sequentially
      db.query(sqlSelect, (err, rows) => {
        if (err) {
          console.error('Error selecting teacher IDs:', err);
          return res.status(500).json({ error: 'Error selecting teacher IDs' });
        }
  
        // Update the IDs sequentially
        const updatePromises = rows.map((row, index) => {
          const newId = index + 1;
          return new Promise((resolve, reject) => {
            db.query('UPDATE teacher SET id = ? WHERE id = ?', [newId, row.id], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
  
        // Execute all the update queries in parallel
        Promise.all(updatePromises)
          .then(() => {
            return res.json({ message: 'Teacher deleted successfully' });
          })
          .catch((err) => {
            console.error('Error updating teacher IDs:', err);
            return res.status(500).json({ error: 'Error updating teacher IDs' });
          });
      });
    });
  });
  

app.listen(3500, ()=> {
    console.log("listening on Port 3500");
})