package emsi.SmartFlow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analysis")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false, unique = true)
    private Long projectId;

    @Column(columnDefinition = "TEXT")
    private String projectSummary;

    @Column(columnDefinition = "LONGTEXT")
    private String tasks;

    @Column(columnDefinition = "LONGTEXT")
    private String sprints;

    @Column(columnDefinition = "LONGTEXT")
    private String risks;

    @Column(columnDefinition = "LONGTEXT")
    private String humanResources;

    @Column(columnDefinition = "LONGTEXT")
    private String materialResources;

    @Column(columnDefinition = "LONGTEXT")
    private String timeline;

    @Column(columnDefinition = "LONGTEXT")
    private String costEstimation;

    private String confidenceScore;
    private String documentQuality;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}