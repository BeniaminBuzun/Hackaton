package pl.agh.hackathon.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.User.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
public class Registration {

    @Autowired
    private UserRepository userRepository;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/user/registration")
    public ResponseDTO registration(@RequestBody RegistrationDTO request) {

        if(userRepository.findByName(request.nick).isPresent()) {
            throw new IllegalArgumentException("User with this nick exists");
        }

        User newUser = new User();
        newUser.setName(request.nick);

        newUser.setPassword(encoder.encode(request.password));

        userRepository.save(newUser);

        return new ResponseDTO(newUser.getId());
    }

}
