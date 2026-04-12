package emsi.SmartFlow.entity;

import emsi.SmartFlow.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * @author HP
 **/
@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Admin extends User {
    private String adminDepartment;
    private String adminSecurityLevel;
}
