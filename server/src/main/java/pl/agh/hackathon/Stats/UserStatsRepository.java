package pl.agh.hackathon.Stats;

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
}