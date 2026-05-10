# Schemat Bazy Danych - Aplikacja Muzyczna Quiz

## Tabele i Relacje

### 1. **users** (Użytkownicy)

| Pole        | Typ     | Opis                      |
| ----------- | ------- | ------------------------- |
| userId (PK) | BIGINT  | Identyfikator użytkownika |
| name        | VARCHAR | Nazwa użytkownika         |
| password    | VARCHAR | Hasło                     |

**Relacje:**

- **ManyToMany** ↔ `quizzes` (przez tabelę połączeniową `quiz_users`)
- **OneToMany** → `answers`

---

### 2. **quizzes** (Quizy)

| Pole         | Typ    | Opis                |
| ------------ | ------ | ------------------- |
| quiz_id (PK) | BIGINT | Identyfikator quizu |

**Relacje:**

- **ManyToMany** ↔ `users` (przez `quiz_users`)
- **OneToMany** → `answers`
- **ElementCollection** → `quiz_question_types` (tablica typów pytań)

---

### 3. **quiz_users** (Tablica połączeniowa - ManyToMany)

| Pole             | Typ    | Opis                  |
| ---------------- | ------ | --------------------- |
| quiz_id (FK, PK) | BIGINT | Klucz obcy do quizzes |
| user_id (FK, PK) | BIGINT | Klucz obcy do users   |

**Klucze zewnętrzne:**

- `fk_quiz_user_quiz` → quizzes.quiz_id
- `fk_quiz_user_user` → users.userId

---

### 4. **quiz_question_types** (Typy pytań w quizie)

| Pole               | Typ     | Opis                  |
| ------------------ | ------- | --------------------- |
| quiz_id (FK, PK)   | BIGINT  | Klucz obcy do quizzes |
| question_type (PK) | VARCHAR | Typ pytania (ENUM)    |

---

### 5. **genres** (Gatunki muzyczne)

| Pole    | Typ     | Opis                   |
| ------- | ------- | ---------------------- |
| id (PK) | BIGINT  | Identyfikator gatunku  |
| name    | VARCHAR | Nazwa gatunku (UNIQUE) |

**Relacje:**

- **OneToMany** → `songs`

---

### 6. **artists** (Artyści)

| Pole    | Typ     | Opis                   |
| ------- | ------- | ---------------------- |
| id (PK) | BIGINT  | Identyfikator artysty  |
| name    | VARCHAR | Nazwa artysty (UNIQUE) |

**Relacje:**

- **OneToMany** → `songs`

---

### 7. **songs** (Piosenki)

| Pole           | Typ     | Opis                   |
| -------------- | ------- | ---------------------- |
| songId (PK)    | BIGINT  | Identyfikator piosenki |
| title          | VARCHAR | Tytuł piosenki         |
| album          | VARCHAR | Album                  |
| releaseDate    | VARCHAR | Data wydania           |
| durationMs     | INT     | Czas trwania (ms)      |
| explicitType   | VARCHAR | Typ zawartości         |
| country        | VARCHAR | Kraj                   |
| audioFile      | VARCHAR | Ścieżka do pliku audio |
| artist_id (FK) | BIGINT  | Klucz obcy do artists  |
| genre_id (FK)  | BIGINT  | Klucz obcy do genres   |

**Relacje:**

- **ManyToOne** → `artists` (fk_song_artist)
- **ManyToOne** → `genres` (fk_song_genre)
- **OneToMany** → `questions`

---

### 8. **questions** (Pytania)

| Pole             | Typ     | Opis                    |
| ---------------- | ------- | ----------------------- |
| question_id (PK) | BIGINT  | Identyfikator pytania   |
| question         | VARCHAR | Treść pytania           |
| question_type    | VARCHAR | Typ pytania (ENUM)      |
| song_id (FK)     | BIGINT  | Klucz obcy do songs     |
| correct_answer   | VARCHAR | Prawidłowa odpowiedź    |
| incorrect_answer | VARCHAR | Nieprawidłowa odpowiedź |
| answer3          | VARCHAR | Trzecia opcja           |
| answer4          | VARCHAR | Czwarta opcja           |

**Relacje:**

- **ManyToOne** → `songs` (fk_question_song)
- **OneToMany** → `answers`

---

### 9. **answers** (Odpowiedzi użytkowników)

| Pole             | Typ     | Opis                     |
| ---------------- | ------- | ------------------------ |
| answer_id (PK)   | BIGINT  | Identyfikator odpowiedzi |
| quiz_id (FK)     | BIGINT  | Klucz obcy do quizzes    |
| question_id (FK) | BIGINT  | Klucz obcy do questions  |
| user_id (FK)     | BIGINT  | Klucz obcy do users      |
| correct_value    | VARCHAR | Czy odpowiedź prawidłowa |
| answer_value     | VARCHAR | Udzielona odpowiedź      |

**Relacje:**

- **ManyToOne** → `quizzes` (fk_answer_quiz)
- **ManyToOne** → `questions` (fk_answer_question)
- **ManyToOne** → `users` (fk_answer_user)

---

## Diagram Relacji

```
┌─────────────┐         ┌──────────────┐
│    users    │◄────────│  quiz_users  │────────►│  quizzes  │
└─────────────┘    M:M  └──────────────┘         └───────────┘
       │                                                │
       │ 1:M                                           │ 1:M
       │                                               │
       ▼                                               ▼
  ┌────────────┐                                  ┌────────────┐
  │  answers   │◄──────────────────────────────────│ questions  │
  └────────────┘      M:1                         └────────────┘
       │                                                │
       │ M:1                                          │ M:1
       │                                               │
       └───────────────────────────────────────────────┘
                        song
                         │
                        1:M
                         │
                         ▼
                    ┌──────────────┐
                    │    songs     │
                    └──────────────┘
                      │          │
                  M:1 │          │ M:1
                      │          │
                      ▼          ▼
                  ┌─────────┐  ┌─────────┐
                  │ artists │  │ genres  │
                  └─────────┘  └─────────┘
```

---

## Podsumowanie Relacji do Dodania

| Relacja               | Tabela 1  | Tabela 2            | Typ | Tabela Połączeniowa     |
| --------------------- | --------- | ------------------- | --- | ----------------------- |
| Users - Quizzes       | users     | quizzes             | M:M | `quiz_users` ✓          |
| Artist - Songs        | artists   | songs               | 1:M | —                       |
| Genre - Songs         | genres    | songs               | 1:M | —                       |
| Song - Questions      | songs     | questions           | 1:M | —                       |
| Quiz - Answers        | quizzes   | answers             | 1:M | —                       |
| Question - Answers    | questions | answers             | 1:M | —                       |
| User - Answers        | users     | answers             | 1:M | —                       |
| Quiz - Question Types | quizzes   | quiz_question_types | 1:M | `quiz_question_types` ✓ |

✓ = już zdefiniowana w kodzie
