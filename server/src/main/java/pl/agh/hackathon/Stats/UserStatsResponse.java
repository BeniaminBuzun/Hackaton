package pl.agh.hackathon.Stats;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsResponse {
    private String userId;
    private int totalAnswers;
    private int correctAnswers;
    private double accuracyPercent;  // np. 75.0
}