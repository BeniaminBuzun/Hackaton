package pl.agh.hackathon.User;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UsernameController {
	private UserRepository userRepository;

	public UsernameController(UserRepository repository) {
		this.userRepository=repository;
	}

	@GetMapping("/{userId}")
	public Optional<UserDTO> getUserName(@PathVariable long userId) {
		return userRepository.getById(userId).map(u -> new UserDTO(u.getId(), u.getName()));
	}
}
