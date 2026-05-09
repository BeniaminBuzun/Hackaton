package pl.agh.hackathon.Quiz;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import pl.agh.hackathon.QuestionType.QuestionType;
import pl.agh.hackathon.User.User;
// import pl.agh.hackathon.Question.Question;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "quizzes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToMany
    @JoinTable(
            name = "quiz_users",
            joinColumns = @JoinColumn(name = "quiz_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> userSet = new HashSet<>();

    @ElementCollection(targetClass = QuestionType.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
            name = "quiz_question_types",
            joinColumns = @JoinColumn(name = "quiz_id")
    )
    @Column(name = "question_type")
    private Set<QuestionType> questionTypesSet = new HashSet<>();



//    @ManyToMany(mappedBy = "id")
//    private Set<Question> questionSet = new HashSet<>();
}
