package pl.agh.hackathon.Quiz.StartQuiz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.User.UserRepository;
import pl.agh.hackathon.answer.Answer;
import pl.agh.hackathon.answer.AnswerRepository;
import pl.agh.hackathon.question.Question;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class StartQuiz {

    @Autowired
    private StartQuizService startQuizService;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${server.address}")
    private String serverAddress;

    @Value("${server.port}")
    private String serverPort;

    @PostMapping("/api/quizes")
    public StartQuizResponseDTO startQuiz(@RequestBody StartQuizRequestDTO request) {
        Optional<User> userOpt = userRepository.findById(request.userId);

        if(userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + request.userId);
        }

        boolean checkOptions = false;
        for(var opt: request.options.values()){
            if(opt){
                checkOptions = true;
                break;
            }
        }

        if (!checkOptions) {
            throw new IllegalArgumentException("Questions Type not selected");
        }

        User user = userOpt.get();

        Quiz quiz = startQuizService.startNewQuiz(request,user);

        return convertQuizToResponse(quiz,user);
    }

    private StartQuizResponseDTO convertQuizToResponse(Quiz quiz, User user) {
        StartQuizResponseDTO response = new StartQuizResponseDTO();
        response.quizId = quiz.getId();

        Map<Long, List<Question>> questionsBySong = quiz.getQuestionSet().stream()
                .filter(q -> q.getSong() != null)
                .collect(Collectors.groupingBy(q -> q.getSong().getId()));

        List<QuestionForMusic> questionsForMusic = new ArrayList<>();
        for (Map.Entry<Long, List<Question>> entry : questionsBySong.entrySet()) {
            QuestionForMusic qfm = new QuestionForMusic();
            qfm.songUrl = serverAddress + ":" + serverPort +"/"+ entry.getValue().getFirst().getSong().getAudioFile();
            qfm.questions = entry.getValue().stream()
                    .map((a)->{return convertQuestionToDTO(a,quiz, user);})
                    .collect(Collectors.toList());
            questionsForMusic.add(qfm);
        }

        response.questionsForMusic = questionsForMusic;
        return response;
    }

    private QuestionDTO convertQuestionToDTO(Question question, Quiz quiz, User user) {
        QuestionDTO dto = new QuestionDTO();
        dto.id = question.getId();
        dto.question = question.getQuestion();

        List<String> answers = new ArrayList<>();
        String correct = question.getAnswer1();

        answers.add(question.getAnswer1());
        answers.add(question.getAnswer2());
        if (question.getAnswer3() != null) {
            answers.add(question.getAnswer3());
        }
        if (question.getAnswer4() != null) {
            answers.add(question.getAnswer4());
        }

        Collections.shuffle(answers);

        for (int i = 0; i < 4 && i < answers.size(); i++) {
            dto.answers[i] = answers.get(i);
        }

        generateAnswer(question, quiz, user, correct);

        return dto;
    }

    private void generateAnswer(Question question, Quiz quiz, User user, String correctAnswer) {
        // 🔥 DEBUGGING
        System.out.println("\n=== GENERATING ANSWER ===");
        System.out.println("Question ID: " + question.getId());
        System.out.println("Question Text: " + question.getQuestion());
        System.out.println("Question.answer1: " + question.getAnswer1());
        System.out.println("Question.answer2: " + question.getAnswer2());
        System.out.println("Question.answer3: " + question.getAnswer3());
        System.out.println("Question.answer4: " + question.getAnswer4());
        System.out.println("Correct Answer Being Set: " + correctAnswer);
        System.out.println("Are they equal? " + (question.getAnswer1() != null && question.getAnswer1().equals(correctAnswer)));
        System.out.println("========================\n");
        
        // Validacja
        if (correctAnswer == null || correctAnswer.isBlank()) {
            throw new IllegalArgumentException("Cannot create Answer with null/blank correctAnswer for question: " + question.getId());
        }
        
        if (question.getAnswer1() == null) {
            throw new IllegalArgumentException("Question " + question.getId() + " has null answer1!");
        }
        
        if (question.getAnswer2() == null) {
            throw new IllegalArgumentException("Question " + question.getId() + " has null answer2!");
        }
        
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setQuiz(quiz);
        answer.setAnswer(null);
        answer.setCorrect(correctAnswer);
        answer.setUser(user);

        answerRepository.save(answer);
    }
}
