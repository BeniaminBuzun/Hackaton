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
@Table(name = "answers")
@Entity
public class Answer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "answer_id", nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(
			name = "quiz_id",
			nullable = false,
			foreignKey = @ForeignKey(name = "fk_answer_quiz")
	)
	private Quiz quiz;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(
			name = "question_id",
			nullable = false,
			foreignKey = @ForeignKey(name = "fk_answer_question")
	)
	private Question question;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(
			name = "user_id",
			nullable = false,
			foreignKey = @ForeignKey(name = "fk_answer_user")
	)
	private User user;

	@Column(name = "correct_value", nullable = false)
	private String correct;

	@Column(name = "answer_value")
	private String answer;
}