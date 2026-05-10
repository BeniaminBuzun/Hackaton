package pl.agh.hackathon.Quiz.SendAnswser;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class SendAnswerDTO {
    @NotBlank
    @Positive
    public long answerId;
    @NotBlank
    public String answer;
}
