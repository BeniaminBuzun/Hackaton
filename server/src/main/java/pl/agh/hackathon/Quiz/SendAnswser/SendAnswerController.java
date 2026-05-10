package pl.agh.hackathon.Quiz.SendAnswser;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.agh.hackathon.answer.Answer;
import pl.agh.hackathon.answer.AnswerRepository;

@RestController
@RequestMapping("/api/quizes")
@RequiredArgsConstructor
public class SendAnswerController {

    private final AnswerRepository answerRepository;

    @PostMapping("/{id}/questions/{nr}/answers")
    @ResponseStatus(HttpStatus.OK)
    public SendAnswerResponseDTO sendAnswer(
            @PathVariable long id,
            @PathVariable long nr,
            @RequestBody SendAnswerDTO dto
    ) {

        Answer answerEntity = answerRepository
                .findByQuizIdAndQuestionId(id, nr)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        boolean isCorrect =
                answerEntity.getCorrect().equalsIgnoreCase(
                        String.valueOf(dto.answerNumber)
                );

        SendAnswerResponseDTO response = new SendAnswerResponseDTO();
        response.answerIsCorrect = isCorrect;

        return response;
    }
}