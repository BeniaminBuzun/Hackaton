package pl.agh.hackathon.Quiz.EndQuiz;

import java.util.ArrayList;
import java.util.List;

public class EndQuizResponse {
    public List<QuestionSummaryDTO> summary = new ArrayList<QuestionSummaryDTO>();
    public int total;
}
