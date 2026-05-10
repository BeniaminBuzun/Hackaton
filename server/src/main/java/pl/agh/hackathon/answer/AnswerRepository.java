package pl.agh.hackathon.answer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.User.User;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
	List<Answer> findByQuizAndUser(Quiz quiz, User user);
}
