package pl.agh.hackathon.Quiz.StartQuiz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import pl.agh.hackathon.QuestionType.QuestionType;
import pl.agh.hackathon.Songs.Song;
import pl.agh.hackathon.Songs.SongRepository;
import pl.agh.hackathon.Genre.Genre;
import pl.agh.hackathon.Genre.GenreRepository;
import pl.agh.hackathon.Artists.Artist;
import pl.agh.hackathon.Artists.ArtistRepository;
import pl.agh.hackathon.question.Question;
import pl.agh.hackathon.question.QuestionRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionGeneratorService {

    @Autowired
    private SongRepository songRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public Question generateQuestionForSongAndType(Song song, QuestionType type) {
        if (song == null) {
            return null;
        }

        Question question = switch (type) {
            case GENRE -> generateGenreQuestion(song);
            case ARTISTS -> generateArtistQuestion(song);
            case SONG_NAME -> generateSongNameQuestion(song);
            case TIME_PERIOD -> generateTimePeriodQuestion(song);
        };

        if (question == null) {
            throw new IllegalArgumentException("Bad type, or database problem");
        }
        String hash = Question.buildHash(question);
        question.setQuestionHash(hash);
        Optional<Question> existed = questionRepository.findByQuestionHash(hash);

        return existed.orElse(question);
    }

    private Question generateGenreQuestion(Song song) {
        if (song.getGenre() == null) {
            return null;
        }

        Question question = new Question();
        question.setQuestion("What genre is this song?");
        question.setType(QuestionType.GENRE);
        question.setSong(song);

        String correctGenre = song.getGenre().getName();
        question.setAnswer1(correctGenre);

        List<Genre> allGenres = genreRepository.findAll();
        List<String> incorrectAnswers = generateIncorrectGenres(correctGenre, allGenres, 3);

        fillRest(incorrectAnswers, question);

        return question;
    }

    private Question generateArtistQuestion(Song song) {
        if (song.getArtist() == null) {
            return null;
        }

        Question question = new Question();
        question.setQuestion("Who is the artist of this song?");
        question.setType(QuestionType.ARTISTS);
        question.setSong(song);

        String correctArtist = song.getArtist().getName();
        question.setAnswer1(correctArtist);

        List<Artist> allArtists = artistRepository.findAll();
        List<String> incorrectAnswers = generateIncorrectArtists(correctArtist, allArtists, 3);

        fillRest(incorrectAnswers, question);

        return question;
    }

    private Question generateSongNameQuestion(Song song) {
        if (song.getTitle() == null) {
            return null;
        }

        Question question = new Question();
        question.setQuestion("What is the name of this song?");
        question.setType(QuestionType.SONG_NAME);
        question.setSong(song);

        String correctSongName = song.getTitle();
        question.setAnswer1(correctSongName);

        List<Song> allSongs = songRepository.findAll();
        List<String> incorrectAnswers = generateIncorrectSongNames(correctSongName, allSongs, 3);

        fillRest(incorrectAnswers, question);

        return question;
    }

    private Question generateTimePeriodQuestion(Song song) {
        if (song.getReleaseDate() == null || song.getReleaseDate().isEmpty()) {
            return null;
        }

        Question question = new Question();
        question.setQuestion("In what decade was this song released?");
        question.setType(QuestionType.TIME_PERIOD);
        question.setSong(song);

        String correctDecade = extractDecadeFromReleaseDate(song.getReleaseDate());
        if (correctDecade == null) {
            return null;
        }

        question.setAnswer1(correctDecade);

        List<String> incorrectAnswers = generateIncorrectDecades(correctDecade, 3);

        fillRest(incorrectAnswers, question);

        return question;
    }

    private void fillRest(List<String> incorrectAnswers, Question question) {
        if (!incorrectAnswers.isEmpty()) {
            question.setAnswer2(incorrectAnswers.getFirst());
        }
        if (incorrectAnswers.size() >= 2) {
            question.setAnswer3(incorrectAnswers.get(1));
        }
        if (incorrectAnswers.size() >= 3) {
            question.setAnswer4(incorrectAnswers.get(2));
        }
    }

    private List<String> generateIncorrectGenres(String correctAnswer, List<Genre> allGenres, int count) {
        List<String> incorrectGenres = allGenres.stream()
                .map(Genre::getName)
                .filter(name -> !name.equals(correctAnswer))
                .collect(Collectors.toList());

        Collections.shuffle(incorrectGenres);
        return incorrectGenres.stream()
                .limit(count)
                .collect(Collectors.toList());
    }

    private List<String> generateIncorrectArtists(String correctAnswer, List<Artist> allArtists, int count) {
        List<String> incorrectArtists = allArtists.stream()
                .map(Artist::getName)
                .filter(name -> !name.equals(correctAnswer))
                .collect(Collectors.toList());

        Collections.shuffle(incorrectArtists);
        return incorrectArtists.stream()
                .limit(count)
                .collect(Collectors.toList());
    }

    private List<String> generateIncorrectSongNames(String correctAnswer, List<Song> allSongs, int count) {
        List<String> incorrectSongNames = allSongs.stream()
                .map(Song::getTitle)
                .filter(title -> title != null && !title.equals(correctAnswer))
                .collect(Collectors.toList());

        Collections.shuffle(incorrectSongNames);
        return incorrectSongNames.stream()
                .limit(count)
                .collect(Collectors.toList());
    }

    private List<String> generateIncorrectDecades(String correctDecade, int count) {
        Set<String> decades = new HashSet<>();

        for (int year = 1900; year <= 2026; year += 10) {
            String decade = year + "'s";
            if (!decade.equals(correctDecade)) {
                decades.add(decade);
            }
        }

        List<String> decadesList = new ArrayList<>(decades);
        Collections.shuffle(decadesList);
        return decadesList.stream()
                .limit(count)
                .collect(Collectors.toList());
    }

    private String extractDecadeFromReleaseDate(String releaseDate) {
        try {
            String yearStr = releaseDate.substring(0, 4);
            int year = Integer.parseInt(yearStr);

            int decade = (year / 10) * 10;
            return decade + "'s";
        } catch (Exception e) {
            return null;
        }
    }
}
