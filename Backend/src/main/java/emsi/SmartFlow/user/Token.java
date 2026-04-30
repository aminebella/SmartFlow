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
    private String token; // → The actual JWT string OR the 6-digit activation code
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createAt;
    private LocalDateTime expiredAt; // → For activation tokens: 15 minutes from creation
    private LocalDateTime validateAt; // → Set when user clicks activation link
    private boolean expired; // → true = this JWT is no longer valid
    private boolean revoked; // → true = manually invalidated (logout)
    @ManyToOne
    @JoinColumn(
            name = "user_id",nullable = false
    )
    private User user;
    // → Each token belongs to one user
    // → Creates "user_id" foreign key column in token table
}
