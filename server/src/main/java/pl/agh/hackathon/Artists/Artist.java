package pl.agh.hackathon.Artists;

import jakarta.persistence.*;
import lombok.*;
import pl.agh.hackathon.Songs.Song;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "artist")
    private List<Song> songs = new ArrayList<>();
}
