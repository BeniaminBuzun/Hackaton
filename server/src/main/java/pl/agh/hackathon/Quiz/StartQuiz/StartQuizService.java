package pl.agh.hackathon.Quiz.StartQuiz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.agh.hackathon.QuestionType.QuestionType;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.Quiz.QuizRepository;
import pl.agh.hackathon.Songs.Song;
import pl.agh.hackathon.Songs.SongRepository;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.User.UserRepository;
import pl.agh.hackathon.question.Question;
import pl.agh.hackathon.question.QuestionRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StartQuizService {

    private static final int SONGS_PER_QUIZ = 10;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private SongRepository songRepository;

    @Autowired
    private QuestionGeneratorService questionGeneratorService;

    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Logika główna do startu quiz
     * Dla każdej piosenki generuje pytania dla wszystkich wybranych typów
     */
    public Quiz startNewQuiz(StartQuizRequestDTO request, User user) {

        Quiz quiz = Quiz.builder()
                .userSet(new HashSet<>(Collections.singleton(user)))
                .questionTypesSet(extractQuestionTypes(request))
                .questionSet(new HashSet<>())
                .build();

        quiz = quizRepository.save(quiz);

        List<Question> generatedQuestions = generateQuestionsForQuiz(request, SONGS_PER_QUIZ);

        quiz.setQuestionSet(new HashSet<>(generatedQuestions));
        quiz = quizRepository.save(quiz);

        for (Question question : generatedQuestions) {
            question.getQuizzes().add(quiz);
            questionRepository.save(question);
        }

        return quiz;
    }

    private Set<QuestionType> extractQuestionTypes(StartQuizRequestDTO request) {
        Set<QuestionType> types = new HashSet<>();
        
        if (request.options != null) {
            var set = request.options.entrySet();
            for (var entry : set) {
                if(entry.getValue()){
                    types.add(entry.getKey());
                }
            }
        }
        
        return types;
    }

    /**
     * Generuje pytania dla quizu
     * Bierze N losowych piosenek i dla każdej generuje pytania dla wszystkich wybranych typów
     * Np. dla 10 piosenek i typów GENRE + ARTISTS = 20 pytań
     */
    private List<Question> generateQuestionsForQuiz(StartQuizRequestDTO request, int numberOfSongs) {
        Set<QuestionType> selectedTypes = extractQuestionTypes(request);
        
        if (selectedTypes.isEmpty()) {
            throw new IllegalArgumentException("No question types selected");
        }

        // Pobierz losowe piosenki
        List<Song> allSongs = songRepository.findAll();
        if (allSongs.isEmpty()) {
            throw new IllegalArgumentException("No songs available in database");
        }

        Collections.shuffle(allSongs);
        List<Song> selectedSongs = allSongs.stream()
                .limit(numberOfSongs)
                .collect(Collectors.toList());

        // Dla każdej piosenki wygeneruj pytania dla wszystkich typów
        List<Question> allQuestions = new ArrayList<>();
        for (Song song : selectedSongs) {
            for (QuestionType type : selectedTypes) {
                Question question = questionGeneratorService.generateQuestionForSongAndType(song, type);
                if (question != null) {
                    allQuestions.add(question);
                }
            }
        }

        questionRepository.saveAll(allQuestions);

        return allQuestions;
    }
}
