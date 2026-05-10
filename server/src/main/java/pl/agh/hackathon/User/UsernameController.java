package pl.agh.hackathon.User;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/api/users")
public class UsernameController {
	private UserRepository userRepository;

	public UsernameController(UserRepository repository) {
		this.userRepository=repository;
	}

	@GetMapping("/{userId}")
	public String getUserName(@PathVariable long userId) {
		Optional<User> user = userRepository.getById(userId);
		if(user.isEmpty())
			return "";
		return user.get().getName();
	}
}
