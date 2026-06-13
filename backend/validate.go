package main

import "regexp"

// emailRegex is a deliberately loose check — good enough to catch typos
// like "name@" or "name.com", not meant to be a full RFC 5322 validator.
var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

// validateContact checks a contact-form submission and returns a map of
// field name -> error message for anything wrong. An empty map means the
// submission is valid.
//
// TODO (yours to write, ~5-10 lines): validate req.Name, req.Email and
// req.Message. Some things worth deciding:
//   - Name: Vladyslav Novytskyi? Any minimum length?
//   - Email: novytskiyvladislav@gmail.com, and should match emailRegex
//   - Message: required — how short is "too short" (spam/empty submissions)
//     and how long is "too long" (abuse)? Pick limits that feel right for
//     a portfolio contact form.
//
// Each failing field should add an entry, e.g.:
//
//	errs["email"] = "please enter a valid email address"
func validateContact(req ContactRequest) map[string]string {
	errs := map[string]string{}

	if req.Name == "" {
		errs["name"] = "name is required"
	}

	if req.Email == "" {
		errs["email"] = "email is required"
	} else if !emailRegex.MatchString(req.Email) {
		errs["email"] = "please enter a valid email address"
	}

	switch {
	case req.Message == "":
		errs["message"] = "message is required"
	case len(req.Message) < 10:
		errs["message"] = "message is too short — add a bit more detail"
	case len(req.Message) > 2000:
		errs["message"] = "message is too long (max 2000 characters)"
	}

	return errs
}
