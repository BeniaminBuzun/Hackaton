import os
import json
import random
import re
from pathlib import Path

import requests


OUTPUT_DIR = "music_quiz_dataset"
TOTAL_TRACKS = 30
COUNTRY = "US"

GENRES = [
    "rock",
    "metal",
    "hip-hop",
    "jazz",
    "classical",
    "electronic",
    "techno",
    "house",
    "phonk",
    "punk",
    "indie",
    "alternative",
    "blues",
    "country",
    "latin",
    "k-pop",
    "j-pop",
    "reggae",
    "ambient",
    "folk"
]

SEARCH_LIMIT_PER_GENRE = 25


AUDIO_DIR = Path(OUTPUT_DIR) / "audio"
ARTWORK_DIR = Path(OUTPUT_DIR) / "artwork"
META_JSON_DIR = Path(OUTPUT_DIR) / "metadata_json"
META_TXT_DIR = Path(OUTPUT_DIR) / "metadata_txt"

for d in [AUDIO_DIR, ARTWORK_DIR, META_JSON_DIR, META_TXT_DIR]:
    d.mkdir(parents=True, exist_ok=True)


def sanitize_filename(name: str) -> str:
    name = re.sub(r'[\\/*?:"<>|]', '', name)
    name = name.strip()
    return name[:180]


def download_file(url: str, filepath: Path):
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            f.write(response.content)

        return True

    except Exception as e:
        print(f"Błąd pobierania {url}: {e}")
        return False


all_tracks = []
used_artists = set()
used_tracks = set()

print("Pobieranie danych z iTunes API...")

random.shuffle(GENRES)

for genre in GENRES:

    if len(all_tracks) >= TOTAL_TRACKS:
        break

    print(f"\nGenre: {genre}")

    url = (
        "https://itunes.apple.com/search"
        f"?term={genre}"
        f"&entity=song"
        f"&limit={SEARCH_LIMIT_PER_GENRE}"
        f"&country={COUNTRY}"
    )

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

    except Exception as e:
        print(f"Błąd API: {e}")
        continue

    results = data.get("results", [])

    random.shuffle(results)

    for track in results:

        if len(all_tracks) >= TOTAL_TRACKS:
            break

        preview_url = track.get("previewUrl")

        if not preview_url:
            continue

        track_name = track.get("trackName", "Unknown")
        artist_name = track.get("artistName", "Unknown")

        unique_track_key = f"{artist_name.lower()}::{track_name.lower()}"

        if unique_track_key in used_tracks:
            continue

        if artist_name.lower() in used_artists:
            continue

        used_tracks.add(unique_track_key)
        used_artists.add(artist_name.lower())

        all_tracks.append(track)

print(f"\nZebrano {len(all_tracks)} utworów")

for idx, track in enumerate(all_tracks, start=1):

    track_name = track.get("trackName", "Unknown")
    artist_name = track.get("artistName", "Unknown")
    genre_name = track.get("primaryGenreName", "Unknown")

    preview_url = track.get("previewUrl")
    artwork_url = track.get("artworkUrl100")

    release_date = track.get("releaseDate")
    collection_name = track.get("collectionName")
    track_time_ms = track.get("trackTimeMillis")
    explicit = track.get("trackExplicitness")
    country = track.get("country")

    base_filename = f"{idx:03d}"

    print(f"\n[{idx}] {artist_name} - {track_name}")


    audio_path = AUDIO_DIR / f"{base_filename}.m4a"

    if preview_url:
        download_file(preview_url, audio_path)


    if artwork_url:
        artwork_large = artwork_url.replace("100x100bb", "600x600bb")
        artwork_path = ARTWORK_DIR / f"{base_filename}.jpg"
        download_file(artwork_large, artwork_path)


    audio_filename = audio_path.name

    metadata = {
        "title": track_name,
        "artist": artist_name,
        "genre": genre_name,
        "album": collection_name,
        "release_date": release_date,
        "duration_ms": track_time_ms,
        "explicit": explicit,
        "country": country,
        "audio_file": audio_filename,
        "artwork_file": f"{base_filename}.jpg"
    }

    json_path = META_JSON_DIR / f"{base_filename}.json"

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)


all_genres = sorted(list(set(
    track.get("primaryGenreName", "Unknown")
    for track in all_tracks
)))


extra_genres = set()

print("Pobieranie dodatkowych gatunków...")

for genre_seed in GENRES:

    url = (
        "https://itunes.apple.com/search"
        f"?term={genre_seed}"
        f"&entity=song"
        f"&limit=100"
        f"&country={COUNTRY}"
    )

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        for item in data.get("results", []):
            genre_name = item.get("primaryGenreName")

            if genre_name:
                extra_genres.add(genre_name)

    except Exception as e:
        print(f"Błąd pobierania dodatkowych gatunków: {e}")

merged_genres = sorted(list(set(all_genres).union(extra_genres)))

genres_json_path = Path(OUTPUT_DIR) / "genres.json"

with open(genres_json_path, "w", encoding="utf-8") as f:
    json.dump([
        {
            "id": idx + 1,
            "name": genre
        }
        for idx, genre in enumerate(merged_genres)
    ], f, ensure_ascii=False, indent=2)

all_artists = sorted(list(set(
    track.get("artistName", "Unknown")
    for track in all_tracks
)))


extra_artists = set()

print("Pobieranie dodatkowych artystów...")

for genre_seed in GENRES:

    url = (
        "https://itunes.apple.com/search"
        f"?term={genre_seed}"
        f"&entity=song"
        f"&limit=100"
        f"&country={COUNTRY}"
    )

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        data = response.json()

        results = data.get("results", [])
        random.shuffle(results)

        for item in results:
            artist_name = item.get("artistName")

            if artist_name:
                extra_artists.add(artist_name)

    except Exception as e:
        print(f"Błąd pobierania dodatkowych artystów: {e}")

merged_artists = sorted(list(set(all_artists).union(extra_artists)))

artists_json_path = Path(OUTPUT_DIR) / "artists.json"

with open(artists_json_path, "w", encoding="utf-8") as f:
    json.dump([
        {
            "id": idx + 1,
            "name": artist
        }
        for idx, artist in enumerate(merged_artists)
    ], f, ensure_ascii=False, indent=2)

print("\nGotowe.")
