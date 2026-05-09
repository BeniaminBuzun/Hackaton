package pl.agh.hackathon.Quiz;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import pl.agh.hackathon.QuestionType.QuestionTypes;
import pl.agh.hackathon.User.User;
//import pl.agh.hackathon.Question.Question;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "quizes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToMany(mappedBy = "quizes")
    private Set<User> userSet = new HashSet<>();

    @ManyToMany(mappedBy = "quizes")
    private Set<QuestionTypes> questionTypesSet = new HashSet<>();

//    @ManyToMany(mappedBy = "quizes")
//    private Set<Question> questionSet = new HashSet<>();
}
