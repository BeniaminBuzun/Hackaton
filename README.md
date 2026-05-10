# Hakaton2026

---
## Zespół 
# 404 TeamNotFound
##  prezentuje
# Music Guesser

Celem zespołu jest wykonanie aplikacji, która ułatwi użytkownikom zapoznywanie się z różnymi gatunkami muzycznymi, zespołami, czy pojedycznymi utworami.
Użytkownik może utworzyć quiz według swoich preferencji, a następnie, słuchając utworów, odgadywać gatunek, autora (zespół muzyczny), a nawet przedział czasowy w którym dany utwór powstał. Przyjazny interfej
Pomoże to chętnym użytkownikom zorientować się w świecie muzycznym lub zapoznać się z nowymi gatunkami, utworami czy zespołami.


## Endpoints

### Endpointy do tworzenia rozgrywki:

1. Metoda POST do tworzenia quizu 

```bash
POST /api/quizes
```

Bierzemy w Body opcje do tworzenia nowego quizu 
- słownik dozwolonych typów <TYP>: <boolean>
- retake boolean (inny rodzaj rozgrywki do poprawiania złych odpowiedzi)
- user id

Zwraca nam jako Response:
- id quizu,
- Listę pytań

Każde pytanie zawiera
- url do utworu,
- listę pytań do danego utworu

Pytanie "do utworu" zawiera
- id pytania,
- treść pytania,
- zestaw odpowiedzi

---

2. Metoda POST do odpowiadania na pytania 

```bash
POST /api/quizes/answer
```

Bierzemy do Body:
- answer id
- treść odpowiedzi udzielonej przez użytkownika

Zwracamy w Response:
- informacje czy dobrze odpowiedzielismy (boolean)

---

3. Metoda GET z wynikami

```bash
GET /api/quizes/{quiz_id}/results/{user_id}
```
Dostajemy w results sumę punktów za cały quiz,
oraz dla kazdego pytania:
- pytanie,
- poprawna odpowiedź,
- udzielona opdowiedź
- punkty za odpowiedź
- tytuł utworu

4. Model bazy danych
![baza.png](baza.png)