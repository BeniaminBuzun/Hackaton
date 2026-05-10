package pl.agh.hackathon.Stats;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private String userId;
    private int totalAnswers;
    private int correctAnswers;
    private double accuracyPercent;
    private int totalGenreAnswers;
    private int correctGenreAnswers;
    private double genreAccuracyPercent;
    private int totalArtistsAnswers;
    private int correctArtistsAnswers;
    private double artistsAccuracyPercent;
    private int totalSongNameAnswers;
    private int correctSongNameAnswers;
    private double songNameAccuracyPercent;
    private int totalTimePeriodAnswers;
    private int correctTimePeriodAnswers;
    private double timePeriodAccuracyPercent;
}