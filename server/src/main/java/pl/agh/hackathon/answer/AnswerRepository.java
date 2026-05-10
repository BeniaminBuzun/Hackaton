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

//    @Modifying
//    @Transactional
//    @Query("""
//    update Answer a
//    set a.answer = :answer
//    where a.quiz.id = :idquiz
//    and a.question.id = :idquestion
//    and a.user.id = :idclient
//""")
//    void updateAnswer(
//            Long idquiz,
//            Long idquestion,
//            Long idclient,
//            String answer
//    );

    @Query("""
    select a from Answer a
    where a.quiz.id = :idquiz
    and a.question.id = :idquestion
    and a.user.id = :idclient
""")
    Answer getAnswerByQQC(
            Long idquiz,
            Long idquestion,
            Long idclient
    );

	List<Answer> findByQuizAndUser(Quiz quiz, User user);
}