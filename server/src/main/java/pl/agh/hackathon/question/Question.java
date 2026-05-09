package pl.agh.hackathon.question;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.Songs.Song;
import pl.agh.hackathon.answer.Answer;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Questions")
@Entity
public class Question {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id", nullable=false)
	private long id;

	@Column(name="question", nullable=false)
	private String question;

	/*
	@Column(name="type", nullable=false)
	@ManyToOne
	private QuestionTypes type;
	*/

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="songId")
	private Song song;

	@Column(name="correctAnswer", nullable=false)
	private String answer1;

	@Column(name="incorrectAnswer", nullable=false)
	private String answer2;

	@Column(name="answer3", nullable=true)
	private String answer3;

	@Column(name="answer4", nullable=true)
	private String answer4;

	@OneToMany(fetch=FetchType.LAZY)
	private List<Answer> answers;
}
