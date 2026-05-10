package pl.agh.hackathon.answer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.question.Question;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Answers")
@Entity
public class Answer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="answerId", nullable=false)
	private long id;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="quizId")
	private Quiz quiz;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="questionId")
	private Question question;

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="userId")
	private User user;

	@Column(name="correctValue", nullable=false)
	private String correct;

	@Column(name="answer", nullable=true)
	private String answer;
}
