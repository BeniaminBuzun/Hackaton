package pl.agh.hackathon.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.agh.hackathon.QuestionType.QuestionType;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByType(QuestionType type);
    Optional<Question> findByQuestionHash(String questionHash);
}
