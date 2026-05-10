package pl.agh.hackathon.Stats;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "Statystyki użytkowników i ranking")
public class UserStatsController {

    private final UserStatsService userStatsService;

    @GetMapping("/{userId}")
    @Operation(
            summary = "Statystyki gracza",
            description = "Zwraca łączną liczbę odpowiedzi i skuteczność gracza",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Statystyki gracza",
                            content = @Content(schema = @Schema(implementation = UserStatsResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Gracz nie istnieje",
                            content = @Content)
            }
    )
    public ResponseEntity<UserStatsResponse> getStats(
            @Parameter(description = "ID użytkownika", example = "user123")
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(userStatsService.getStats(userId));
    }

    @GetMapping("/leaderboard")
    @Operation(
            summary = "Ranking graczy",
            description = "Zwraca paginowaną listę graczy posortowanych po skuteczności. Kategoria: OVERALL, GENRE, ARTISTS, SONG_NAME, TIME_PERIOD",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista graczy",
                            content = @Content(schema = @Schema(implementation = LeaderboardResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Nieprawidłowy limit lub kategoria",
                            content = @Content)
            }
    )
    public ResponseEntity<LeaderboardResponse> getLeaderboard(
            @Parameter(description = "Numer strony (od 1)", example = "1")
            @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Liczba wyników na stronie (10 lub 20)", example = "10")
            @RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "Kategoria rankingu", example = "OVERALL")
            @RequestParam(defaultValue = "OVERALL") LeaderboardCategory category
    ) {
        if (limit != 10 && limit != 20) {
            return ResponseEntity.badRequest().build();
        }
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(userStatsService.getLeaderboard(pageable, page, limit, category));
    }


}