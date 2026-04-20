package emsi.SmartFlow.entity.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectTeamKey implements Serializable {

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "client_id")
    private Long clientId;
    // → Primary key = (project_id + client_id) combined
    // → Same user can't be in the same project twice
}
