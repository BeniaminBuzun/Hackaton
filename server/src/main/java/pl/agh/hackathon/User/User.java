package pl.agh.hackathon.User;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.answer.Answer;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="userId")
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @ManyToMany(mappedBy = "userSet",fetch=FetchType.LAZY)
    private Set<Quiz> quizSet = new HashSet<>();

	@OneToMany(fetch=FetchType.LAZY)
	private Set<Answer> answers;
}
