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

    // Atomicznie inkrementuje liczniki — bez wyścigu przy równoczesnych requestach
    @Modifying
    @Query("""  
        UPDATE UserStats s
        SET s.totalAnswers   = s.totalAnswers + :total,
            s.correctAnswers = s.correctAnswers + :correct
        WHERE s.userId = :userId
    """)
    int incrementStats(
            @Param("userId")  String userId,
            @Param("total")   int total,
            @Param("correct") int correct
    );

    // Sortowanie po accuracy wymaga kalkulacji — robimy to przez @Query
    // Zwykłe sortowanie po correctAnswers jako przybliżenie też działa
    Page<UserStats> findAllByOrderByCorrectAnswersDesc(Pageable pageable);

    // Lub jeśli chcesz sortować po prawdziwej skuteczności (correctAnswers/totalAnswers):
    @Query("""
        SELECT s FROM UserStats s
        WHERE s.totalAnswers > 0
        ORDER BY (CAST(s.correctAnswers AS double) / s.totalAnswers) DESC
    """)
    Page<UserStats> findAllByAccuracyDesc(Pageable pageable);
}