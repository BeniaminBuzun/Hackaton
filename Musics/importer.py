import json
import sqlite3
from pathlib import Path

DB_PATH = Path(r"D:\Hackaton\server\quiz.db")
print(DB_PATH)

DATASET_DIR = Path("music_quiz_dataset")
SONGS_DIR = DATASET_DIR / "metadata_json"
GENRES_FILE = DATASET_DIR / "genres.json"
ARTISTS_FILE = DATASET_DIR / "artists.json"

DB_PATH.parent.mkdir(parents=True, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


cursor.execute("""
CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    album TEXT,
    release_date TEXT,
    duration_ms INTEGER,
    explicit_type TEXT,
    country TEXT,
    audio_file TEXT NOT NULL,
    artist_id INTEGER,
    genre_id INTEGER,

    FOREIGN KEY (artist_id) REFERENCES artists(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
)
""")


with open(GENRES_FILE, "r", encoding="utf-8") as f:
    genres = json.load(f)

for genre in genres:
    cursor.execute(
        "INSERT OR IGNORE INTO genres(name) VALUES(?)",
        (genre["name"],)
    )

# Import artists

with open(ARTISTS_FILE, "r", encoding="utf-8") as f:
    artists = json.load(f)

for artist in artists:
    cursor.execute(
        "INSERT OR IGNORE INTO artists(name) VALUES(?)",
        (artist["name"],)
    )

# Import songs

for json_file in SONGS_DIR.glob("*.json"):

    with open(json_file, "r", encoding="utf-8") as f:
        song = json.load(f)

    cursor.execute(
        "SELECT id FROM artists WHERE name = ?",
        (song["artist"],)
    )
    artist_row = cursor.fetchone()
    artist_id = artist_row[0] if artist_row else None

    cursor.execute(
        "SELECT id FROM genres WHERE name = ?",
        (song["genre"],)
    )
    genre_row = cursor.fetchone()
    genre_id = genre_row[0] if genre_row else None

    cursor.execute("""
        INSERT INTO songs(
            title,
            album,
            release_date,
            duration_ms,
            explicit_type,
            country,
            audio_file,
            artist_id,
            genre_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        song["title"],
        song["album"],
        song["release_date"],
        song["duration_ms"],
        song["explicit"],
        song["country"],
        song["audio_file"],
        artist_id,
        genre_id
    ))

conn.commit()
conn.close()

print("Import zakończony.")
