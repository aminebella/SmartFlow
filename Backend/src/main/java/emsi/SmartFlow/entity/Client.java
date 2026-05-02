package emsi.SmartFlow.entity;
import emsi.SmartFlow.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.util.List;


@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Client extends User {

    @Column(name = "post_title")
    private String postTitle;          // intitulé du post

    @Column(name = "profile_picture", length = 500)
    private String profilePicture;     // img de profil

    @Column(name = "cover_picture", length = 500)
    private String coverPicture;       // img de couverture

    @Column(name = "location")
    private String location;           // emplacement

    @OneToMany(mappedBy = "client")
    private List<ProjectTeam> projectTeams;

    @OneToMany(mappedBy = "owner")
    private List<Project> ownedProjects;
}