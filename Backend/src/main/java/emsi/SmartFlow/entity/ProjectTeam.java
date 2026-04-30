package emsi.SmartFlow.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import emsi.SmartFlow.entity.enums.ProjectTeamRole;
import emsi.SmartFlow.entity.keys.ProjectTeamKey;
import emsi.SmartFlow.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_team")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class ProjectTeam {

    @EmbeddedId
    private ProjectTeamKey id; // → Composite PK

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false)
    private Project project; // → Which project

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("clientId")
    @JoinColumn(name = "client_id", nullable = false)
    private Client client; // → Which client (only Clients join projects, not Admins)

    @Enumerated(EnumType.STRING)
    @Column(name = "project_role", nullable = false)
    private ProjectTeamRole projectRole; // → MEMBER or MANAGER

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt; // → Auto-set on creation

    @PrePersist // → @PrePersist = runs automatically before inserting to DB
    protected void onCreate() {
        if (joinedAt == null) {
            joinedAt = LocalDateTime.now();
        }
    }
}
