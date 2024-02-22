const StudentData = require('../../models/Student/StudentData');
const express = require('express');
const app = express();
const axios = require('axios');


app.post('/students',async function(req, res){
    const student =new StudentData(req.body);
    await student.save();
    res.json(student);

});
app.get('/students',async function(req, res){
   const student = await StudentData.find();
   res.json(student);

});
app.delete("/students/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    await StudentData.findByIdAndDelete(id);
    res.json({ message: "Student deleted successfully" });
  });
  
module.exports =app;