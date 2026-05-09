package pl.agh.hackathon.Quiz.StartQuiz;

import pl.agh.hackathon.QuestionType.QuestionType;

import java.util.Dictionary;

public class StartQuizRequestDTO {
    public Dictionary<QuestionType, Boolean> options;
    public boolean retake = false;
    public long userId;
}

