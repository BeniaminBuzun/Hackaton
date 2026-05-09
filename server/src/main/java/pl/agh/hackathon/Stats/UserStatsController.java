package pl.agh.hackathon.Stats;

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
}