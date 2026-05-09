package pl.agh.hackathon.Stats;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}