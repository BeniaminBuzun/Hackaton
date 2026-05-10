package pl.agh.hackathon.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.hackathon.User.User;
import pl.agh.hackathon.User.UserRepository;

import java.util.Optional;

@RestController
public class Login {

    @Autowired
    private UserRepository userRepository;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/api/user/login")
    public ResponseDTO login(@RequestBody RegistrationDTO request) {


        Optional<User> finded = userRepository.findByName(request.nick);
        if (finded.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = finded.get();

        if(!encoder.matches(request.password,user.getPassword())){
            throw new IllegalArgumentException("Wrong password");
        }

        return new ResponseDTO(user.getId());
    }
}
