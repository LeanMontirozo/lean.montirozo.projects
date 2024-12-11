const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/musicDB';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
});

const Music = mongoose.model('Music', musicSchema);

app.get('/api/getall', async (req, res) => {
  try {
    const tracks = await Music.find();
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tracks', error });
  }
});

app.get('/api/:id', async (req, res) => {
  try {
    const track = await Music.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving track', error });
  }
});

app.post('/api/add', async (req, res) => {
  try {
    const newTrack = new Music(req.body);
    const savedTrack = await newTrack.save();
    res.status(201).json(savedTrack);
  } catch (error) {
    res.status(400).json({ message: 'Error adding track', error });
  }
});

app.put('/api/update/:id', async (req, res) => {
  try {
    const updatedTrack = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrack) return res.status(404).json({ message: 'Track not found' });
    res.status(200).json(updatedTrack);
  } catch (error) {
    res.status(400).json({ message: 'Error updating track', error });
  }
});

app.delete('/api/delete/:id', async (req, res) => {
  try {
    const deletedTrack = await Music.findByIdAndDelete(req.params.id);
    if (!deletedTrack) return res.status(404).json({ message: 'Track not found' });
    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting track', error });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

