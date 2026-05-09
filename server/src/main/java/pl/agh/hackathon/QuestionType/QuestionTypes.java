package pl.agh.hackathon.QuestionType;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

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

    @Column(nullable = false)
    private QuestionType questionType;

    @ManyToMany(mappedBy = "question_types")
    private Set<QuestionTypes> questionTypesSet = new HashSet<>();
}
