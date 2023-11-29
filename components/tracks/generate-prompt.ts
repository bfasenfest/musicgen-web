export default function generateMusicPrompt() {
  // Extend the lists of musical elements
  const genres = [
    "Classic Rock",
    "Synthpop",
    "Disco",
    "Pop",
    "Trip Hop",
    "Jazz",
    "Blues",
    "Electronic",
    "Hip Hop",
    "Classical",
    "Reggae",
    "Country",
    "Folk",
    "Metal",
  ];
  const instruments = [
    "Drum Kit",
    "Electric Guitar",
    "Bass",
    "Synthesizer",
    "Piano",
    "Guitars",
    "Rhodes",
    "Choir",
    "Violin",
    "Saxophone",
    "Trumpet",
    "Flute",
    "Cello",
    "Harp",
  ];
  const qualities = [
    "Raw",
    "Uplifting",
    "Anthem",
    "Moody",
    "Melancholic",
    "Melodic",
    "Atmospheric",
    "Nostalgic",
    "Cool",
    "Striped-back",
    "Instrumental",
    "Clubby",
    "Euphoric",
    "Honest",
    "Heart-Felt",
    "Dreamy",
    "Groovy",
    "Introspective",
    "Thoughtful",
    "Beautiful",
    "Edgy",
    "Dynamic",
    "Soulful",
    "Vibrant",
    "Chill",
  ];
  const types = [
    "Pop Instrumental",
    "Vocal Sample Chops",
    "Cinematic",
    "Soundtrack",
    "Billboard",
    "Club",
    "Acoustic",
    "Live Performance",
    "Studio Recording",
    "Experimental",
    "Cover",
    "Remix",
    "Mashup",
  ];
  const tempos = [
    "60 BPM",
    "85 BPM",
    "100 BPM",
    "115 BPM",
    "130 BPM",
    "150 BPM",
    "175 BPM",
  ];

  // Helper function to get a random item from an array
  const getRandomItem = (array: string | any[]) =>
    array[Math.floor(Math.random() * array.length)];

  // Generate random tags
  const selectedGenre = getRandomItem(genres);
  const selectedInstruments = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => getRandomItem(instruments)
  );
  const selectedQualities = Array.from(
    { length: Math.floor(Math.random() * 3) + 2 },
    () => getRandomItem(qualities)
  );
  const selectedType = getRandomItem(types);
  const selectedTempo = getRandomItem(tempos);

  // Combine the tags into a string
  return `${selectedGenre}, ${selectedInstruments.join(
    ", "
  )}, ${selectedQualities.join(", ")}, ${selectedType}, ${selectedTempo}`;
}
