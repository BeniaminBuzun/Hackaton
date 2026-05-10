package pl.agh.hackathon.answer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.User.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    Optional<Answer> findById(long answerId);

    @Modifying
    @Query("update Answer a set a.correct = :answer where a.id = :id ")
    void updateAnswer(Long id, String answer);
	List<Answer> findByQuizAndUser(Quiz quiz, User user);
}