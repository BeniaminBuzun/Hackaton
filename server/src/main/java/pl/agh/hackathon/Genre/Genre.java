package pl.agh.hackathon.Genre;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.Songs.Song;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "genres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "genre")
    private List<Song> songs = new ArrayList<>();
}
