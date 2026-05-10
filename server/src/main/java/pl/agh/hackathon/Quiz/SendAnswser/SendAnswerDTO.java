package pl.agh.hackathon.Quiz.SendAnswser;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class SendAnswerDTO {
    @NotBlank
    @Positive
    public long quizId;
    @NotBlank
    @Positive
    public long questionId;

    @NotBlank
    public String answer;

    @NotBlank
    @Positive
    public long userId;
}
