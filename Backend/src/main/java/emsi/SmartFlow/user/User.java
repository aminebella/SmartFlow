    package emsi.SmartFlow.user;

    import emsi.SmartFlow.role.Role;
    import com.fasterxml.jackson.annotation.JsonIdentityInfo;
    import com.fasterxml.jackson.annotation.ObjectIdGenerators;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import lombok.experimental.SuperBuilder;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.authority.SimpleGrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;

    import java.security.Principal;
    import java.time.LocalDateTime;
    import java.util.Collection;
    import java.util.List;
    import java.util.stream.Collectors;


    @Entity
    @Inheritance(strategy = InheritanceType.JOINED)  // ← JOINED strategy creates 3 tables: _user, admin, client: each have their OWN table with just their extra columns
    // → They're linked by sharing the same ID (JOIN in SQL)
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @SuperBuilder
    @Table(name = "_user")
    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    public class User implements UserDetails, Principal {
        // → UserDetails = Spring Security interface. Means "this class can be used as a logged-in user"
        // → Principal = Java security interface meaning "this is an authenticated identity"
        @Id
        @GeneratedValue(
                strategy = GenerationType.SEQUENCE,
                generator = "user_seq"
        )// → SEQUENCE = uses a DB sequence to auto-increment IDs (more reliable than AUTO)
        @SequenceGenerator(
                name = "user_seq",
                sequenceName = "user_seq",
                allocationSize = 1,
                initialValue = 0
        )
        private Long id;
        private String firstname;
        private String lastname;
        @Column(unique = true)
        private String email; // → unique = no two users with same email
        private String password; // → stored hashed (BCrypt), not plain text
        private boolean accountLocked; // → can lock a user (like banning)
        private boolean enabled; // → false until they click activation email
        @CreatedDate
        @Column(updatable = false)
        private LocalDateTime createdAt;
        @LastModifiedDate
        @Column(insertable = false)
        private LocalDateTime lastModifiedAt;

        // → A user can have multiple roles (ADMIN, CLIENT)
        // → EAGER = load roles immediately when loading user (needed for security checks)
        // → Creates a join table "users_roles" in the DB
        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(
                name = "users_roles",
                joinColumns = @JoinColumn(name = "_user_id"),
                inverseJoinColumns =@JoinColumn(name =  "role_id")
        )
        private List<Role> roles;

        @OneToMany
        private List<Token> tokens; // → A user can have multiple JWT tokens


        public User(String firstname, String lastname, String email, String password) {
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
            this.password = password;
        }

        // --- Methods required by UserDetails interface ---
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return this.roles.stream().map(r->new SimpleGrantedAuthority(r.getName())).collect(Collectors.toList());
            // → Converts roles ["ADMIN", "CLIENT"] into Spring Security "authority" objects
            // → Spring uses this to check permissions
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public String getUsername() {
            // → Spring Security uses EMAIL as the "username" for login
            return email;
        }

        @Override
        public String getName() {
            return email;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            // → If accountLocked=true, login fails with LockedException
            return !accountLocked;
        }

        @Override
        public boolean isCredentialsNonExpired() {
              return true;
         }

        @Override
        public boolean isEnabled() {
            // → If enabled=false (not verified email), login fails with DisabledException
            return enabled;
        }


         public String getFullName(){
            // → Helper method, used in JWT token and emails
            return firstname +" "+ lastname;
         }
    }
