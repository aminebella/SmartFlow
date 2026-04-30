package emsi.SmartFlow.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import emsi.SmartFlow.entity.enums.ProjectStatus;

@Entity
@Table(name = "projects", uniqueConstraints = {
        // Same owner cannot have 2 projects with same name
        @UniqueConstraint(columnNames = {"name", "owner_id"})
})
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private LocalDateTime estimatedStartDate;
    private LocalDateTime estimatedEndDate;

    private LocalDateTime realStartDate;
    private LocalDateTime realEndDate;

    private double estimatedBudget;
    private double realBudget;

    @OneToMany(mappedBy = "project")
    private List<ProjectTeam> projectTeams;
    // → One project has many team members

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Client owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;// Default = ACTIVE on creation, no need to set it manually

}
