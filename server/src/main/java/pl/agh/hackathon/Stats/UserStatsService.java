package pl.agh.hackathon.Stats;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final UserStatsRepository userStatsRepository;

    public UserStatsResponse getStats(String userId) {
        UserStats stats = userStatsRepository.findById(userId)
                .orElse(UserStats.builder()
                        .userId(userId)
                        .totalAnswers(0)
                        .correctAnswers(0)
                        .build());

        double accuracy = stats.getTotalAnswers() == 0
                ? 0.0
                : (double) stats.getCorrectAnswers() / stats.getTotalAnswers() * 100;

        return new UserStatsResponse(
                stats.getUserId(),
                stats.getTotalAnswers(),
                stats.getCorrectAnswers(),
                Math.round(accuracy * 10.0) / 10.0
        );
    }

    @Transactional
    public void recordAnswers(String userId, int total, int correct) {
        int updated = userStatsRepository.incrementStats(userId, total, correct);
        if (updated == 0) {
            userStatsRepository.save(UserStats.builder()
                    .userId(userId)
                    .totalAnswers(total)
                    .correctAnswers(correct)
                    .build());
        }
    }

    public LeaderboardResponse getLeaderboard(Pageable pageable, int page, int limit) {
        Page<UserStats> pageResult = userStatsRepository.findAllByAccuracyDesc(pageable);

        int offset = (page - 1) * limit;
        List<LeaderboardEntryDto> entries = new ArrayList<>();

        List<UserStats> content = pageResult.getContent();
        for (int i = 0; i < content.size(); i++) {
            UserStats s = content.get(i);

            double accuracy = s.getTotalAnswers() == 0
                    ? 0.0
                    : (double) s.getCorrectAnswers() / s.getTotalAnswers() * 100;

            entries.add(new LeaderboardEntryDto(
                    offset + i + 1,                          // globalny rank
                    s.getUserId(),
                    s.getTotalAnswers(),
                    s.getCorrectAnswers(),
                    Math.round(accuracy * 10.0) / 10.0
            ));
        }

        return new LeaderboardResponse(
                entries,
                new LeaderboardMeta(
                        page,
                        limit,
                        pageResult.getTotalElements(),
                        pageResult.getTotalPages()
                )
        );
    }
}