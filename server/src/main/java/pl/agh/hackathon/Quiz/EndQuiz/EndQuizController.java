package pl.agh.hackathon.Quiz.EndQuiz;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.hackathon.QuestionType.QuestionType;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.Quiz.QuizRepository;
import pl.agh.hackathon.Songs.Song;
import pl.agh.hackathon.Stats.UserStats;
import pl.agh.hackathon.Stats.UserStatsRepository;
import pl.agh.hackathon.Stats.UserStatsService;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.User.UserRepository;
import pl.agh.hackathon.answer.Answer;
import pl.agh.hackathon.answer.AnswerRepository;
import pl.agh.hackathon.question.Question;

import java.util.*;


@RestController
@RequestMapping("/api/quizes")
@Transactional
public class EndQuizController {

	@Autowired
	private UserStatsService statsService;

	private final AnswerRepository answerRepository;
	private final QuizRepository quizRepository;
	private final UserRepository userRepository;

	public EndQuizController(AnswerRepository answerRepository,QuizRepository quizRepository, UserRepository userRepository) {
		this.answerRepository=answerRepository;
		this.quizRepository=quizRepository;
		this.userRepository=userRepository;
	}

	@GetMapping("/{quizId}/results/{userId}")
	public EndQuizResponse summary(@PathVariable String quizId, @PathVariable String userId) {
		long qid=Long.parseLong(quizId);
		long uid=Long.parseLong(userId);

		Optional<Quiz> oQuiz = quizRepository.getById(qid);
		Optional<User> oUser = userRepository.getById(uid);

		if(oQuiz.isEmpty() || oUser.isEmpty()) {
			EndQuizResponse response = new EndQuizResponse();
			response.summary=new ArrayList<>();
			response.total=0;
			return response;
		}

		//List<Answer> answers = answerRepository.findByQuizAndUser(qid,uid);
		List<Answer> answers = answerRepository.findByQuizAndUser(oQuiz.get(),oUser.get());
		ArrayList<QuestionSummaryDTO> summaries = new ArrayList<>();
		int score=0;

		Map<QuestionType, Integer> mapScore = new HashMap<QuestionType, Integer>();
		Map<QuestionType, Integer> mapTotal = new HashMap<QuestionType, Integer>();

		for (QuestionType type : QuestionType.values()) {
			mapScore.put(type, 0);
			mapTotal.put(type, 0);
		}

		for(Answer answer : answers) {
			QuestionSummaryDTO summary = new QuestionSummaryDTO();
			if(Objects.equals(answer.getAnswer(), answer.getCorrect())) {
				score++;
				summary.points=1;
			}
			Question question = answer.getQuestion();
			Song song=question.getSong();

			mapScore.merge(question.getType(), summary.points, Integer::sum);
			mapTotal.merge(question.getType(), 1, Integer::sum);

			summary.answer=answer.getAnswer();
			summary.correctAnswer=answer.getCorrect();
			summary.question=question.getQuestion();
			summary.title=song.getTitle();
			summaries.add(summary);
		}

		EndQuizResponse response = new EndQuizResponse();
		response.summary=summaries;
		response.total=score;


		statsService.recordAnswers(Long.parseLong(userId),answers.size(),score,mapTotal, mapScore);

		return response;
	}
}
