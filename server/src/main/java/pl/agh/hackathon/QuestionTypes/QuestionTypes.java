package pl.agh.hackathon.QuestionTypes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question_types")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionTypes
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
}
