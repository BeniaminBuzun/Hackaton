# Hakaton2026

---
## Zespół 
# 404 TeamNotFound
##  prezentuje
# Music Guesser

Celem zespołu jest wykonanie aplikacji, która ułatwi użytkownikom zapoznawanie się z różnymi gatunkami muzycznymi, zespołami, czy pojedycznymi utworami.

Na rynku brakuje aplikacji lub serwisów przez które pasjonaci muzyki mogliby porównywać swoją znajomość świata muzyki, a samo poznawanie różnorodnych gatunków i artystów jest długotrwałym procesem.
Ta aplikacja ma za zadanie jednocześnie umożliwić użytkownikom na rywalizację w tej dziedzinie, oraz zapoznać się z dobrej jakości reprezentantami gatunków, czy okresów czasowych.

Użytkownik może utworzyć quiz według swoich preferencji, a następnie, słuchając utworów, odgadywać gatunek, autora (zespół muzyczny), a nawet przedział czasowy w którym dany utwór powstał.

##Scenariusz użycia

Po wejściu na ekran główny użytkownik może się zarejestrować lub zalogować podając nazwę użytkownika oraz hasło.
Po udanym logowaniu, użytkownik może zobaczyć swój profil, statystyki oraz rankingi lub rozpocząć quiz.

Zalogowany użytkownik może przed rozpoczęciem quizu dostosować jego zakres i typ pytań.
Podczas trwania quizu, użytkownik wybiera jedną z dostępnych odpowiedzi a następnie otrzymuje informację o poprawnej odpowiedzi.
Przechodzi do następnego pytania przez naciśnięcie odpowiedniego przycisku.

Po zakończeniu quizu, użytkownik może zobaczyć podsumowanie quizu.
Pomoże to chętnym użytkownikom zorientować się w świecie muzycznym lub zapoznać się z nowymi gatunkami, utworami czy zespołami.


## Endpoints

### Endpointy do obsługi klienta:

1. Metoda POST do rejestracji nowego użytkownika

```bash
POST /user/registration
```

Format zapytania:

{
    "nick" : "username",
    "password" : "password
}

Format odpowiedzi:
{
    "id" : 2137
}

2. Metoda POST do logowania użytkownika

```bash
POST /user/login
```

Format zapytania:

{
    "nick" : "username",
    "password" : "password
}

Format odpowiedzi:
{
    "id" : 67
}

3. Metoda GET do odczytania nazwy danego użytkownika

```bash
GET /user/{userId}
```

Format zapytania: puste

Format odpowiedzi:
"username"



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
POST /api/quizes/answers
```

Bierzemy do Body:
- quiz id
- user id
- question id
- treść odpowiedzi udzielonej przez użytkownika

Zwracamy w Response:
- informacje czy udzielona odpowiedź jest poprawna (boolean)
- poprawną odpowiedź
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
