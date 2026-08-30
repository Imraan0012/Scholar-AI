package com.scholarai.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class AuthenticatedUser implements UserDetails {

    private final UUID userId;
    private final String email;
    private final String role;
    private final Collection<? extends GrantedAuthority> authorities;

    public AuthenticatedUser(UUID userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role != null ? role : "ROLE_USER";
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(
                this.role.startsWith("ROLE_") ? this.role : "ROLE_" + this.role.toUpperCase()
        ));
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return email != null ? email : userId.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
