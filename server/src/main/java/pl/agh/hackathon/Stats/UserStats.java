package pl.agh.hackathon.Stats;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStats {

    @Id
    @Column(name = "user_id", nullable = false)
    private long userId;

    @Column(nullable = false)
    private int totalAnswers;

    @Column(nullable = false)
    private int correctAnswers;

    @Column(nullable = false)
    private int totalGenreAnswers;

    @Column(nullable = false)
    private int correctGenreAnswers;

    @Column(nullable = false)
    private int totalArtistsAnswers;

    @Column(nullable = false)
    private int correctArtistsAnswers;

    @Column(nullable = false)
    private int totalSongNameAnswers;

    @Column(nullable = false)
    private int correctSongNameAnswers;

    @Column(nullable = false)
    private int totalTimePeriodAnswers;

    @Column(nullable = false)
    private int correctTimePeriodAnswers;
}