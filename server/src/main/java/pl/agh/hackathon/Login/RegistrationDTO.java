package pl.agh.hackathon.Login;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public class RegistrationDTO {
    @NotBlank
    @Length(min = 3, max = 20)
    public String nick;
    public String password;
}
