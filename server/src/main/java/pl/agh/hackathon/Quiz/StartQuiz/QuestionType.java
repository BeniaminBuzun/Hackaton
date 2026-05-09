package pl.agh.hackathon.Quiz.StartQuiz;

public enum QuestionType {
    GENRE("Genre"),
    ARTIST("Artist"),
    TITLE("Title"),
    DATE("Date");

    private final String displayName;

    QuestionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
