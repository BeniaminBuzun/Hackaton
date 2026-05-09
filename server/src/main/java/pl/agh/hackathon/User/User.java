package pl.agh.hackathon.User;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.Quiz.Quiz;

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
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @ManyToMany(mappedBy = "userSet")
    private Set<Quiz> quizSet = new HashSet<>();
}
