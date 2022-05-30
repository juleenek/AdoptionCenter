# Projekt AdoptionCenter

## API do aplikacji 

Aplikacja pozwala na zarządzanie ośrodkami adopcyjnymi, psami znajdującymi się w ośrodkach, użytkownikami korzystającymi z aplikacji oraz spotkaniami adopcyjnymi umówionymi przez użytkowników. 

Aplikacja umożliwia ośrodkowi adopcyjnemu szybkie zaakceptowanie lub anulowanie spotkania adopcyjnego umówionego przez użytkownika, który chcę spotkać się z psem oraz z personelem schroniska przed dokonaniem adopcji. 

Użytkownik ma możliwość zajerestrowania się oraz zalogowania w aplikacji.

### Funkcjonalności: 

- Centrum adopcyjne - CRUD danych dla ośrodka adopcyjnego 

  - (POST, DELETE oraz PUT - założenie, usunięcie oraz aktualizacja danych konta dla schroniska jest możliwa tylko dla administratora aplikacji)
  
- Użytkownik - CRUD danych dla użytkownika aplikacji 

  - (GET, DELETE - użytkowników oraz konkretnego użtkownika o podanym ID może wyświetlić administrator aplikacji, zalogowany użytkownik może wyświetlić dane tylko o swoim profilu, usunięcie konta jest możliwe zarówno dla administratora jak i dla użytkownika aplikacji)
 
- Pies - CRUD danych dla psa znajdującego się w ośrodku adopcyjnym 

  - (POST, DELETE oraz PUT - założenie, usunięcie oraz aktualizacja danych psa jest możliwa tylko dla zalogowanego schroniska)

- Spotkanie adopcyjne - CRUD danych dla spotkania adopcyjnego 

  - (POST oraz DELETE - umówienie spotkania jest możliwe tylko dla użytkownika, usunięcie spotkania odbywa się przez zalogowanego użytkownika bądź     schroniska, GET - spotkanie o konkretnym ID oraz wszystkie spotkania adopcyjne może wyświetlić schronisko, jeśli dotyczą tego zalogowanego konkretnego centrum, spotkanie o konkretnym ID może wyświetlić użytkownik, jeśli spotkanie to zostało umówione przez niego)
  

