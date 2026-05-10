package pl.agh.hackathon.Stats;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.xml.crypto.dsig.spec.XSLTTransformParameterSpec;

@Data
@AllArgsConstructor
public class LeaderboardEntryDto {
    private int rank;
    private String username;
    private long userId;
    private int totalAnswers;
    private int correctAnswers;
    private double accuracyPercent;
}