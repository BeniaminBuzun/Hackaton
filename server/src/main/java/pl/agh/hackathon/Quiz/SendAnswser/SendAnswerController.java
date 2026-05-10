package pl.agh.hackathon.Quiz.SendAnswser;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.hackathon.answer.Answer;
import pl.agh.hackathon.answer.AnswerRepository;

@RestController
@RequestMapping("/api/quizes")
@RequiredArgsConstructor
public class SendAnswerController {

    private final AnswerRepository answerRepository;

    @PostMapping("/answers")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public SendAnswerResponseDTO sendAnswer(
            @RequestBody SendAnswerDTO dto
    ) {

        Long questionId = dto.questionId;
        long quizId = dto.quizId;
        String answer = dto.answer;
        long clientID = dto.userId;

        Answer answerEntity = answerRepository.getAnswerByQQC(quizId,questionId,clientID);

        if(answerEntity == null) {
            throw new IllegalArgumentException("Answer not found");
        }
        answerEntity.setAnswer(answer);

        boolean isCorrect =
                answerEntity.getCorrect().equalsIgnoreCase(answer);

        SendAnswerResponseDTO response = new SendAnswerResponseDTO();
        response.answerIsCorrect = isCorrect;
        response.answerCorrect = answerEntity.getCorrect();

        return response;
    }
}