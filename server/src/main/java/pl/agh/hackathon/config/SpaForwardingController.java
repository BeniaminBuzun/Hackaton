package pl.agh.hackathon.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController {

    @RequestMapping(value = {
            "/",
            "/{path:[^\\.]*}",
            "/**/{path:[^\\.]*}"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
