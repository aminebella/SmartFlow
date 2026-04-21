package emsi.SmartFlow.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Token {
    @Id @GeneratedValue
    private Long id;
    private String token;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createAt;
    private LocalDateTime expiredAt;
    private LocalDateTime validateAt;
    private boolean expired;
    private boolean revoked;
    @ManyToOne
    @JoinColumn(
            name = "user_id",nullable = false
    )
    private User  user;
}
