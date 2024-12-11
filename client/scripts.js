const API_BASE_URL = '/api';

const loadTracks = async () => {
  const response = await fetch(`${API_BASE_URL}/getall`);
  const tracks = await response.json();
  const trackList = document.getElementById('tracks');
  trackList.innerHTML = tracks.map(track => `<div class='track'><b>${track.title}</b> by ${track.artist}</div>`).join('');
};

const searchTracks = async () => {
  const query = document.getElementById('search').value.toLowerCase();
  const response = await fetch(`${API_BASE_URL}/getall`);
  const tracks = await response.json();
  const filteredTracks = tracks.filter(track => track.title.toLowerCase().includes(query));
  const trackList = document.getElementById('tracks');
  trackList.innerHTML = filteredTracks.map(track => `<div class='track'><b>${track.title}</b> by ${track.artist}</div>`).join('');
};

window.onload = loadTracks;
