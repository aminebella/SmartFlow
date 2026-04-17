package emsi.SmartFlow.entity;

import emsi.SmartFlow.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

/**
 * @author HP
 **/

@Entity
@Table(name = "clients")  // Child table
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Client extends User {
    private String bio;

    @OneToMany(mappedBy = "client")
    private List<ProjectTeam> projectTeams;

}
