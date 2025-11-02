package cafe.service;

import cafe.dto.AuthResponse;
import cafe.dto.LoginRequest;
import cafe.dto.RegisterRequest;
import cafe.entity.User;
import cafe.repository.UserRepository;
import cafe.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(User.Role.USER);
        
        user = userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRole().name());
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getRole()
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRole().name());
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getRole()
        );
    }
}