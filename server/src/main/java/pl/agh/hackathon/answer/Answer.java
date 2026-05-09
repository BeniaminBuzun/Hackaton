package pl.agh.hackathon.answer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
	@Column(name="id", nullable=false)
	private long id;

	/*
	@Column(name="quizId", nullable=false)
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id")
	Quiz quiz;
	 */

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="questionId")
	private Question question;

	/*
	@Column(name="userId", nullable=false)
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="id")
	User user;
	 */

	@Column(name="correctValue", nullable=false)
	private int correct;

	@Column(name="answer", nullable=true)
	private Integer answer;
}
