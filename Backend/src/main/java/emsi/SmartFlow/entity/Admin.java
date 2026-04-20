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
// → Separate "admins" table with just the admin's id (which references _user.id)
// → Admin has NO extra fields — it's just a User with the ADMIN role
public class Admin extends User {

}
