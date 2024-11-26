// models/skill.js
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: String,
    description: String,
  });

const Skill = mongoose.model('Skill', skillSchema, 'skills'); // 'skills' is the collection name

export default Skill;
