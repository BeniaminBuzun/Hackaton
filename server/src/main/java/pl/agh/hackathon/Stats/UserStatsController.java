package pl.agh.hackathon.Stats;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pl.agh.hackathon.Stats.UserStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.agh.hackathon.Stats.UserStatsService;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserStatsService userStatsService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserStatsResponse> getStats(@PathVariable String userId) {
        return ResponseEntity.ok(userStatsService.getStats(userId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<LeaderboardResponse> getLeaderboard(
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        if (limit != 10 && limit != 20) {
            return ResponseEntity.badRequest().build();
        }

        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(userStatsService.getLeaderboard(pageable, page, limit));
    }
}