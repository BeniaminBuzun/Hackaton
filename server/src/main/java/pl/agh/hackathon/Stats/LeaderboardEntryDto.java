package pl.agh.hackathon.Stats;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntryDto {
    private int rank;
    private long userId;
    private int totalAnswers;
    private int correctAnswers;
    private double accuracyPercent;
}