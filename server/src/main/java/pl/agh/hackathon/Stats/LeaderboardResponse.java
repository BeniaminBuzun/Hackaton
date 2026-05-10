package pl.agh.hackathon.Stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class LeaderboardResponse {
    private List<LeaderboardEntryDto> data;
    private LeaderboardMeta meta;
}