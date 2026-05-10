package pl.agh.hackathon.question;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import pl.agh.hackathon.QuestionType.QuestionType;
import pl.agh.hackathon.Quiz.Quiz;
import pl.agh.hackathon.Songs.Song;
import pl.agh.hackathon.answer.Answer;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
@Entity
public class Question {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private Long id;

	@NotBlank(message = "Question text cannot be blank")
	@Column(nullable = false)
	private String question;

	@Enumerated(EnumType.STRING)
	@Column(name = "question_type")
	private QuestionType type;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(
			name = "song_id",
			foreignKey = @ForeignKey(name = "fk_question_song")
	)
	private Song song;

	@NotBlank(message = "Correct answer (answer1) cannot be blank")
	@Column(name = "correct_answer", nullable = false)
	private String answer1;

	@NotBlank(message = "Incorrect answer (answer2) cannot be blank")
	@Column(name = "incorrect_answer", nullable = false)
	private String answer2;

	@Column(name = "answer3")
	private String answer3;

	@Column(name = "answer4")
	private String answer4;

	// 🔥 FIX: BRAK FK = DB TOOLS NIE WIDZĄ RELACJI
	@OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
	private List<Answer> answers;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "question_quiz",
			joinColumns = @JoinColumn(
					name = "question_id",
					foreignKey = @ForeignKey(name = "fk_question_quiz_q")
			),
			inverseJoinColumns = @JoinColumn(
					name = "quiz_id",
					foreignKey = @ForeignKey(name = "fk_question_quiz_quiz")
			)
	)
	private Set<Quiz> quizzes = new HashSet<>();

	@Column(name = "question_hash", unique = true)
	private String questionHash;

	public static String buildHash(Question q) { return (q.getQuestion() + "|" + q.getType() + "|" + q.getSong().getId() + "|" + q.getAnswer1() + "|" + q.getAnswer2() + "|" + q.getAnswer3() + "|" + q.getAnswer4()) .replace("null", "") .toLowerCase(); }
}