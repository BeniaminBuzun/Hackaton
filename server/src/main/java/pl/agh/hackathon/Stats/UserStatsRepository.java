package pl.agh.hackathon.Stats;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, String> {

    @Modifying
    @Query("""
        UPDATE UserStats s
        SET s.totalAnswers              = s.totalAnswers + :total,
            s.correctAnswers            = s.correctAnswers + :correct,
            s.totalGenreAnswers         = s.totalGenreAnswers + :totalGenre,
            s.correctGenreAnswers       = s.correctGenreAnswers + :correctGenre,
            s.totalArtistsAnswers       = s.totalArtistsAnswers + :totalArtists,
            s.correctArtistsAnswers     = s.correctArtistsAnswers + :correctArtists,
            s.totalSongNameAnswers      = s.totalSongNameAnswers + :totalSongName,
            s.correctSongNameAnswers    = s.correctSongNameAnswers + :correctSongName,
            s.totalTimePeriodAnswers    = s.totalTimePeriodAnswers + :totalTimePeriod,
            s.correctTimePeriodAnswers  = s.correctTimePeriodAnswers + :correctTimePeriod
        WHERE s.userId = :userId
    """)
    int incrementStats(
            @Param("userId")             String userId,
            @Param("total")              int total,
            @Param("correct")            int correct,
            @Param("totalGenre")         int totalGenre,
            @Param("correctGenre")       int correctGenre,
            @Param("totalArtists")       int totalArtists,
            @Param("correctArtists")     int correctArtists,
            @Param("totalSongName")      int totalSongName,
            @Param("correctSongName")    int correctSongName,
            @Param("totalTimePeriod")    int totalTimePeriod,
            @Param("correctTimePeriod")  int correctTimePeriod
    );

    @Query("""
    SELECT s FROM UserStats s WHERE s.totalAnswers > 0
    ORDER BY (CAST(s.correctAnswers AS double) / s.totalAnswers) DESC
""")
    Page<UserStats> findAllByOverallAccuracy(Pageable pageable);

    @Query("""
    SELECT s FROM UserStats s WHERE s.totalGenreAnswers > 0
    ORDER BY (CAST(s.correctGenreAnswers AS double) / s.totalGenreAnswers) DESC
""")
    Page<UserStats> findAllByGenreAccuracy(Pageable pageable);

    @Query("""
    SELECT s FROM UserStats s WHERE s.totalArtistsAnswers > 0
    ORDER BY (CAST(s.correctArtistsAnswers AS double) / s.totalArtistsAnswers) DESC
""")
    Page<UserStats> findAllByArtistsAccuracy(Pageable pageable);

    @Query("""
    SELECT s FROM UserStats s WHERE s.totalSongNameAnswers > 0
    ORDER BY (CAST(s.correctSongNameAnswers AS double) / s.totalSongNameAnswers) DESC
""")
    Page<UserStats> findAllBySongNameAccuracy(Pageable pageable);

    @Query("""
    SELECT s FROM UserStats s WHERE s.totalTimePeriodAnswers > 0
    ORDER BY (CAST(s.correctTimePeriodAnswers AS double) / s.totalTimePeriodAnswers) DESC
""")
    Page<UserStats> findAllByTimePeriodAccuracy(Pageable pageable);
}