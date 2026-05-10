package pl.agh.hackathon.Quiz;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.QuestionType.QuestionType;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.question.Question;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private Long id;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "quiz_users",
            joinColumns = @JoinColumn(
                    name = "quiz_id",
                    foreignKey = @ForeignKey(name = "fk_quiz_user_quiz")
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "user_id",
                    foreignKey = @ForeignKey(name = "fk_quiz_user_user")
            )
    )
    private Set<User> userSet = new HashSet<>();

    @ElementCollection(targetClass = QuestionType.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
            name = "quiz_question_types",
            joinColumns = @JoinColumn(
                    name = "quiz_id",
                    foreignKey = @ForeignKey(name = "fk_quiz_qtype_quiz")
            )
    )
    @Column(name = "question_type")
    private Set<QuestionType> questionTypesSet = new HashSet<>();

    @ManyToMany(mappedBy = "quizzes", fetch = FetchType.LAZY)
    private Set<Question> questionSet = new HashSet<>();
}