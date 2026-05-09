package pl.agh.hackathon.Quiz.StartQuiz;

public class QuestionDTO {
    public long id;
    public String question;

    // Id in this array => id in table answer (after randomize)
    public String[] answers = new String[4];
}
