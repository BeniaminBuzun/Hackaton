package pl.agh.hackathon.Stats;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardMeta {
    private int page;
    private int limit;
    private long totalPlayers;
    private int totalPages;
}