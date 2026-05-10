package pl.agh.hackathon.Quiz.SendAnswser;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class SendAnswerDTO {
    @NotBlank
    @Positive
    public long questionId;
    @NotBlank
    @Positive
    public int answerId;
    @NotBlank
    @Positive
    public int answer;
    @NotBlank
    @Positive
    public long userId;
}
