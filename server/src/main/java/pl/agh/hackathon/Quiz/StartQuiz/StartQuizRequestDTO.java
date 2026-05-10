package pl.agh.hackathon.Quiz.StartQuiz;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.*;
import pl.agh.hackathon.QuestionType.QuestionType;

import java.util.Map;

public class StartQuizRequestDTO {

    @NotEmpty
    @Size(min=4, max=4)
    public Map<QuestionType, Boolean> options;

    public boolean retake = false;

    @NotBlank
    @Positive
    public long userId;
}

