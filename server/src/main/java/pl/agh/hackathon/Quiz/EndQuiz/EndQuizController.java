package pl.agh.hackathon.Quiz.EndQuiz;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.Quiz.QuizRepository;
import pl.agh.hackathon.Songs.Song;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.User.UserRepository;
import pl.agh.hackathon.answer.Answer;
import pl.agh.hackathon.answer.AnswerRepository;
import pl.agh.hackathon.question.Question;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@RestController
@RequestMapping("/api/quizes")
public class EndQuizController {

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

		for(Answer answer : answers) {
			QuestionSummaryDTO summary = new QuestionSummaryDTO();
			if(Objects.equals(answer.getAnswer(), answer.getCorrect())) {
				score++;
				summary.points=1;
			}
			Question question = answer.getQuestion();
			Song song=question.getSong();

			summary.answer=answer.getAnswer();
			summary.correctAnswer=answer.getCorrect();
			summary.question=question.getQuestion();
			summary.title=song.getTitle();
			summaries.add(summary);
		}

		EndQuizResponse response = new EndQuizResponse();
		response.summary=summaries;
		response.total=score;

		return response;
	}
}
