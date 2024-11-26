import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Project from './models/project.js';
import Skill from './models/skills.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Contact route to handle form submissions
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate the form data
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Nodemailer transport configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,  // Change to your recipient email
    subject: 'New Contact Form Submission',
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
    html: `<p>You have a new message from <strong>${name}</strong> (${email}):</p><p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send message, please try again later.' });
  }
});

// Routes for Project CRUD operations
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

app.post('/projects', async (req, res) => {
  try {
    const { name, description, link } = req.body;
    const newProject = new Project({ name, description, link });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const { name, description, link } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, link },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted', deletedProject });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

// Routes for Skill CRUD operations
app.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: 'No skills found' });
    }
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error });
  }
});

app.post('/skills', async (req, res) => {
  try {
    const { name, level, description } = req.body;
    const newSkill = new Skill({ name, level, description });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill', error });
  }
});

app.put('/skills/:id', async (req, res) => {
  try {
    const { name, level, description } = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, level, description },
      { new: true }
    );
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill', error });
  }
});

app.delete('/skills/:id', async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted', deletedSkill });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
