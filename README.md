# Hakaton2026

---


## Endpoints

### Endpointy do tworzenia rozgrywki:

1. Metoda POST do tworzenia quizu 

```bash
POST /api/quizes
```

Bierzemy w Body opcje do tworzenia nowego quizu 
(klucz -> boolean)
- genre
- autor
- kolor skóry
- liczba pytań
- retake (inny rodzaj rozgrywki do poprawiania złych odpowiedzi)
- user id

Zwraca nam jako Response:
Dicta z :
- id quizu
- Wszystkie pytania

---

2. Metoda POST do odpowiadania na pytania 

```bash
POST /api/quizes/{id}/questions/{nr}/answers
```

Bierzemy do Body:
- user id
- quiz id
- question number
- dict with answers ( genre->answer, author->answer etc.)

Zwracamy w Response:
- informacje czy dobrze odpowiedzielismy oraz string z tą odpowiedzią

---

3. Metoda GET z wynikami

```bash
GET /api/quizes/{id}/results
```

Dostajemy w results:
- pytanie wraz z poprawną odpowiedzią oraz informacją czy dobrze na nią odpowiedzieliśmy


