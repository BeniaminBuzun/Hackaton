package pl.agh.hackathon.Stats;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.agh.hackathon.QuestionType.QuestionType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final UserStatsRepository userStatsRepository;

    // answers = { GENRE -> true, ARTISTS -> false, ... }
    @Transactional
    public void recordAnswers(String userId, Map<QuestionType, Boolean> answers) {
        int total   = answers.size();
        int correct = (int) answers.values().stream().filter(Boolean::booleanValue).count();

        int totalGenre      = answers.containsKey(QuestionType.GENRE)       ? 1 : 0;
        int correctGenre    = isCorrect(answers, QuestionType.GENRE);
        int totalArtists    = answers.containsKey(QuestionType.ARTISTS)     ? 1 : 0;
        int correctArtists  = isCorrect(answers, QuestionType.ARTISTS);
        int totalSongName   = answers.containsKey(QuestionType.SONG_NAME)   ? 1 : 0;
        int correctSongName = isCorrect(answers, QuestionType.SONG_NAME);
        int totalTimePeriod    = answers.containsKey(QuestionType.TIME_PERIOD) ? 1 : 0;
        int correctTimePeriod  = isCorrect(answers, QuestionType.TIME_PERIOD);

        int updated = userStatsRepository.incrementStats(
                userId,
                total, correct,
                totalGenre, correctGenre,
                totalArtists, correctArtists,
                totalSongName, correctSongName,
                totalTimePeriod, correctTimePeriod
        );

        if (updated == 0) {
            userStatsRepository.save(UserStats.builder()
                    .userId(userId)
                    .totalAnswers(total)
                    .correctAnswers(correct)
                    .totalGenreAnswers(totalGenre)
                    .correctGenreAnswers(correctGenre)
                    .totalArtistsAnswers(totalArtists)
                    .correctArtistsAnswers(correctArtists)
                    .totalSongNameAnswers(totalSongName)
                    .correctSongNameAnswers(correctSongName)
                    .totalTimePeriodAnswers(totalTimePeriod)
                    .correctTimePeriodAnswers(correctTimePeriod)
                    .build());
        }
    }

    private int isCorrect(Map<QuestionType, Boolean> answers, QuestionType type) {
        return Boolean.TRUE.equals(answers.get(type)) ? 1 : 0;
    }

    public UserStatsResponse getStats(String userId) {
        UserStats s = userStatsRepository.findById(userId)
                .orElse(UserStats.builder().userId(userId).build());

        return UserStatsResponse.builder()
                .userId(s.getUserId())
                .totalAnswers(s.getTotalAnswers())
                .correctAnswers(s.getCorrectAnswers())
                .accuracyPercent(calcAccuracy(s.getTotalAnswers(), s.getCorrectAnswers()))
                .totalGenreAnswers(s.getTotalGenreAnswers())
                .correctGenreAnswers(s.getCorrectGenreAnswers())
                .genreAccuracyPercent(calcAccuracy(s.getTotalGenreAnswers(), s.getCorrectGenreAnswers()))
                .totalArtistsAnswers(s.getTotalArtistsAnswers())
                .correctArtistsAnswers(s.getCorrectArtistsAnswers())
                .artistsAccuracyPercent(calcAccuracy(s.getTotalArtistsAnswers(), s.getCorrectArtistsAnswers()))
                .totalSongNameAnswers(s.getTotalSongNameAnswers())
                .correctSongNameAnswers(s.getCorrectSongNameAnswers())
                .songNameAccuracyPercent(calcAccuracy(s.getTotalSongNameAnswers(), s.getCorrectSongNameAnswers()))
                .totalTimePeriodAnswers(s.getTotalTimePeriodAnswers())
                .correctTimePeriodAnswers(s.getCorrectTimePeriodAnswers())
                .timePeriodAccuracyPercent(calcAccuracy(s.getTotalTimePeriodAnswers(), s.getCorrectTimePeriodAnswers()))
                .build();
    }

    public LeaderboardResponse getLeaderboard(Pageable pageable, int page, int limit, LeaderboardCategory category) {
        Page<UserStats> pageResult = switch (category) {
            case OVERALL     -> userStatsRepository.findAllByOverallAccuracy(pageable);
            case GENRE       -> userStatsRepository.findAllByGenreAccuracy(pageable);
            case ARTISTS     -> userStatsRepository.findAllByArtistsAccuracy(pageable);
            case SONG_NAME   -> userStatsRepository.findAllBySongNameAccuracy(pageable);
            case TIME_PERIOD -> userStatsRepository.findAllByTimePeriodAccuracy(pageable);
        };

        int offset = (page - 1) * limit;
        List<LeaderboardEntryDto> entries = new ArrayList<>();
        List<UserStats> content = pageResult.getContent();

        for (int i = 0; i < content.size(); i++) {
            UserStats s = content.get(i);

            double accuracy = switch (category) {
                case OVERALL     -> calcAccuracy(s.getTotalAnswers(), s.getCorrectAnswers());
                case GENRE       -> calcAccuracy(s.getTotalGenreAnswers(), s.getCorrectGenreAnswers());
                case ARTISTS     -> calcAccuracy(s.getTotalArtistsAnswers(), s.getCorrectArtistsAnswers());
                case SONG_NAME   -> calcAccuracy(s.getTotalSongNameAnswers(), s.getCorrectSongNameAnswers());
                case TIME_PERIOD -> calcAccuracy(s.getTotalTimePeriodAnswers(), s.getCorrectTimePeriodAnswers());
            };

            entries.add(new LeaderboardEntryDto(
                    offset + i + 1,
                    s.getUserId(),
                    s.getTotalAnswers(),
                    s.getCorrectAnswers(),
                    accuracy
            ));
        }

        return new LeaderboardResponse(entries,
                new LeaderboardMeta(page, limit, pageResult.getTotalElements(), pageResult.getTotalPages()));
    }

    private double calcAccuracy(int total, int correct) {
        if (total == 0) return 0.0;
        return Math.round((double) correct / total * 1000.0) / 10.0;
    }
}