package pl.agh.hackathon.Quiz.SendAnswser;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
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

        Long answerId = dto.answerId;
        String answer = dto.answer;

        answerRepository.updateAnswer(answerId, answer);

        Answer answerEntity = answerRepository
                .findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        System.out.println(answerEntity.getCorrect() + " "+ answer);

        boolean isCorrect =
                answerEntity.getCorrect().equalsIgnoreCase(answer);

        SendAnswerResponseDTO response = new SendAnswerResponseDTO();
        response.answerIsCorrect = isCorrect;

        return response;
    }
}