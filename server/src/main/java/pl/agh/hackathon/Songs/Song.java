package pl.agh.hackathon.Songs;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.Artists.Artist;
import pl.agh.hackathon.Genre.Genre;
import pl.agh.hackathon.question.Question;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="songId")
    private long id;

    private String title;

    private String album;

    private String releaseDate;

    private int durationMs;

    private String explicitType;

    private String country;

    @Column(nullable = false)
    private String audioFile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;

	@OneToMany
	Set<Question> questions;
}
